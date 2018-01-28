// @flow
import axios from 'axios';

import Track from 'TrackManager/Track';
import moment from 'moment';
import type { Show, EpisodeSummary, Dj, TrackMetadata } from './Types';
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
  const track = getOrCreateTrack(audioUrl, metadata);
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

const ROOT_URL = 'https://live2.takomaradio.org/spinitron/audioapi2.php';

export function getAllShows() {
  return axios.get(ROOT_URL, { params: { request: 'showsbyday' } })
    .then(resp => convertAllShows(resp.data));
}

export function getShow(id : number) {
  return axios.get(ROOT_URL, { params: { request: 'showinfo', id } })
    .then(resp => convertShow(resp.data));
}

