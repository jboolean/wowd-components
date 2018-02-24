// @flow
import axios from 'axios';

import Track from 'TrackManager/Track';
import moment from 'moment';
import type { Show, EpisodeSummary, Dj, TrackMetadata, Playlist } from './Types';
import TrackManagerSingleton from 'TrackManager';
import TrackManagerType from 'TrackManager/TrackManager';
const TrackManager = (TrackManagerSingleton : TrackManagerType<TrackMetadata>);

// prevents duplicate Tracks from being created.
const trackCatalog : {[string] : Track<TrackMetadata>} = {};

const getOrCreateTrack = (url : string, metadata : TrackMetadata) : Track<TrackMetadata> => {
  if (!(url in trackCatalog)) {
    trackCatalog[url] = TrackManager.createTrack(url, metadata);
  }
  return trackCatalog[url];
};

const convertTime = (date : string, time : string) : moment =>
  moment(date + ' ' + time, 'YYYY-MM-DD HH:mm');

const convertEpisodeSummary = (apiEpisode : *, apiShow : *) : EpisodeSummary => {
  const onAirAtStr = apiEpisode.onAirAt || apiShow.onAirAt;
  const offAirAtStr = apiEpisode.offAirAt || apiShow.offAirAt;
  const onAirAt = convertTime(apiEpisode.date, onAirAtStr);
  const offAirAt = convertTime(apiEpisode.date, offAirAtStr);
  const audioUrl = apiEpisode.audioUrl;
  const metadata : TrackMetadata = {
    showName: apiShow.name,
    djs: apiShow.djs,
    song: null,
    isLive: false,
    onAirAt
  };
  const track = audioUrl !== null ? getOrCreateTrack(audioUrl, metadata) : null;
  return {
    id: apiEpisode.id,
    name: apiEpisode.name,
    description: apiEpisode.description,
    onAirAt,
    offAirAt,
    audioUrl,
    track
  };
};

const convertShow = (apiShow : *) : Show => {
  const djs = (apiShow.djs : Dj[]);
  const episodes : EpisodeSummary[] = (apiShow.episodes || [])
    .map(apiEpisode => convertEpisodeSummary(apiEpisode, apiShow));
  episodes.sort((a, b) => b.onAirAt.unix() - a.onAirAt.unix());
  return {
    id: apiShow.id,
    description: apiShow.description,
    name: apiShow.name,
    djs,
    episodes
  };
};

const convertAllShows = (apiShows : []) : Show[] => {
  const results = apiShows.map(convertShow);
  results.sort((a, b) => a.name.localeCompare(b.name));
  return results;
};

const convertPlaylist = (apiPlaylist : *) : Playlist => {
  const songs = apiPlaylist.songs.map(apiSong => {
    return {
      airedOn: convertTime(apiSong.date, apiSong.onAirAt),
      id: apiSong.id,
      song: {
        name: apiSong.song,
        artist: apiSong.artist,
        album: apiSong.disk
      }
    };
  });

  return {
    id: apiPlaylist.id,
    songs
  };
};

const ROOT_URL = 'https://live2.takomaradio.org/spinitron/audioapi2.php';

export function getAllShows() : Promise<Show[]> {
  return axios.get(ROOT_URL, { params: { request: 'showsbyday' } })
    .then(resp => convertAllShows(resp.data));
}

export function getShow(id : number) : Promise<Show> {
  return axios.get(ROOT_URL, { params: { request: 'showinfo', id } })
    .then(resp => convertShow(resp.data));
}

export function getEpisode(showId : number, episodeId : number) : Promise<EpisodeSummary> {
  return getShow(showId)
    .then(show => {
      const foundEpisode = show.episodes.find(episode => episode.id === episodeId);
      if (!foundEpisode) {
        throw new Error('Episode not found in show.');
      }
      return foundEpisode;
    });
}

export function getPlaylist(episodeId : number) : Promise<Playlist> {
  return axios.get(ROOT_URL, { params: { request: 'episodeinfo', id: episodeId } })
    .then(resp => convertPlaylist(resp.data));
}
