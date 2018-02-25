import type { Song } from 'util/Types';
import axios from 'axios';

// TODO implement backend to get these tokens. This is temporary and does not work.
const getSpotifyToken = () : Promise<string> => {
  return Promise.resolve('BQCBhoEuEOWy1Qkd53NtT-q_HC31WqzWqYMQQgVByLvWGO2GM_96_Z1dYZq5hzJbzhGAgoRNeGGkcEtO2XY');
};

/**
 * Searches Spotify for a Song and returns a spotify track uri, or null.
 */
export function findSongUri(song : Song) : Promise<?string> {
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
    });
}