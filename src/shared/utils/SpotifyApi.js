// @flow
import axios from 'axios';
import moment from 'moment';


let lastRequest : ?Promise<string>;
let nextExpiration : ?moment;

const getSpotifyToken = (): Promise<string> => {
  if (!lastRequest || (nextExpiration && nextExpiration.isBefore())) {
    nextExpiration = null;
    lastRequest = axios.get('https://live2.takomaradio.org/spotifyToken.php')
      .then((resp) => {
        nextExpiration = moment().add(resp.data.expires_in, 'seconds');
        return resp.data.access_token;
      });
  }
  return lastRequest;
};

const BACKOFF_INTERVAL = 5000;

/**
 * Searches Spotify for a Song and returns a spotify track uri, or null.
 */
export function findSongUri(song: {name: string, artist: string}): Promise<?string> {
  return getSpotifyToken()
    .then((token) => {
      const q = `track:${song.name} artist:${song.artist}`;
      return axios.get('https://api.spotify.com/v1/search', {
        params: { q, limit: 1, type: 'track' },
        headers: { Authorization: 'Bearer ' + token }
      });
    })
    .then((resp) => {
      const tracks = resp.data.tracks.items;
      if (!tracks.length) {
        return null;
      }
      return tracks[0].uri;
    })
    .catch((error) => {
      const resp = error.response;
      if (resp && resp.status >= 500) {
        console.error('Error from Spotify. Retrying…', error);
        return new Promise((resolve, reject) => {
          setTimeout(() => findSongUri(song).then(resolve, reject), BACKOFF_INTERVAL);
        });
      }
      throw error;
    });
}