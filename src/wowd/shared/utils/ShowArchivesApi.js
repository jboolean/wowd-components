// @flow
import axios from 'axios';

import Track from 'TrackManager/Track';
import moment from 'moment';
import type { Show, EpisodeSummary, DjSummary, Dj, TrackMetadata, Playlist } from './Types';
import Alternations from 'utils/Alternations';
import TrackManagerSingleton from 'TrackManager';
import TrackManagerType from 'TrackManager/TrackManager';
const TrackManager = (TrackManagerSingleton: TrackManagerType<TrackMetadata>);

// prevents duplicate Tracks from being created.
const trackCatalog : {[string]: Track<TrackMetadata>} = {};

const getOrCreateTrack = (url: string, metadata: TrackMetadata): Track<TrackMetadata> => {
  if (!(url in trackCatalog)) {
    trackCatalog[url] = TrackManager.createTrack(url, metadata);
  }
  return trackCatalog[url];
};

const convertTime = (date: string, time: string): moment =>
  moment(date + ' ' + time, 'YYYY-MM-DD HH:mm');

const convertTimeOfWeek = (dayOfWeek: string, time: string): moment =>
  moment(dayOfWeek + ' ' + time, 'ddd HH:mm');

const convertEpisodeSummary = (apiEpisode: *, apiShow: *): EpisodeSummary => {
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
    id: '' + apiEpisode.id,
    name: apiEpisode.name,
    description: apiEpisode.description,
    onAirAt,
    offAirAt,
    audioUrl,
    track,
    hasPlaylist: !apiEpisode.suppressPlaylist
  };
};

const convertShow = (apiShow: *): Show => {
  const djs = (apiShow.djs: DjSummary[]);
  const episodes : ?(EpisodeSummary[]) = apiShow.episodes ? apiShow.episodes
    .map(apiEpisode => convertEpisodeSummary(apiEpisode, apiShow)) : null;
  if (episodes) {
    episodes.sort((a, b) => b.onAirAt.unix() - a.onAirAt.unix());
  }
  const airTimes = apiShow.daysOfWeek.map(dow => {
    const onAirAt = convertTimeOfWeek(dow, apiShow.onAirAt);
    const offAirAt = convertTimeOfWeek(dow, apiShow.offAirAt);
    if (offAirAt.isBefore(onAirAt)) {
      offAirAt.add(1, 'day');
    }
    return {
      onAirAt,
      offAirAt
    };
  });
  let alternationId = Alternations.EVERY_WEEK;
  if (apiShow.week === 1) {
    alternationId = Alternations.WEEK_1;
  } else if (apiShow.week === 2) {
    alternationId = Alternations.WEEK_2;
  }
  let imageUrl;
  if (apiShow.showImage) {
    imageUrl = apiShow.showImage.imageUrl;
  }
  return {
    id: apiShow.id,
    description: apiShow.description,
    name: apiShow.name,
    djs,
    episodes,
    airTimes,
    externalUrl: apiShow.externalUrl,
    alternationId,
    imageUrl
  };
};

const convertAllShows = (apiShows: []): Show[] => {
  const results = apiShows.map(convertShow);
  results.sort((a, b) => a.name.localeCompare(b.name));
  return results;
};

const convertPlaylist = (apiPlaylist: *): Playlist => {
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

  songs.sort((a, b) => a.airedOn.unix() - b.airedOn.unix());

  return {
    id: apiPlaylist.id,
    songs
  };
};

const ROOT_URL = 'https://live2.takomaradio.org/spinitron/audioapi2.php';

export function getAllShows(): Promise<Show[]> {
  return axios.get(ROOT_URL, { params: { request: 'showsbyday' } })
    .then(resp => convertAllShows(resp.data));
}

export function getShow(id: number): Promise<Show> {
  return axios.get(ROOT_URL, { params: { request: 'showinfo', id } })
    .then(resp => convertShow(resp.data));
}

export function getEpisode(showId: number, episodeId: string | number): Promise<EpisodeSummary> {
  return getShow(showId)
    .then(show => {
      if (!show.episodes) {
        throw new Error('Show has no episodes.');
      }
      const foundEpisode = show.episodes.find(episode => episode.id === episodeId);
      if (!foundEpisode) {
        throw new Error('Episode not found in show.');
      }
      return foundEpisode;
    });
}

export function getPlaylist(episodeId: string | number): Promise<Playlist | null> {
  return axios.get(ROOT_URL, { params: { request: 'episodeinfo', id: episodeId } })
    .then(resp => {
      return convertPlaylist(resp.data);
    }, (err) => {
      if (err.response.status === 404) {
        return null;
      }
      throw err;
    });
}

export function getDj(djId: string | number): Promise<Dj | null> {
  return Promise.resolve({
    id: 1,
    imageUrl: null,
    name: 'John Smith',
    website: 'http://www.example.com',
    description: `
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
      Pellentesque quis eros cursus, ornare sem in, consequat nunc. 
      In odio velit, elementum vitae accumsan eget, sodales sit amet nunc. 
      Quisque erat justo, sollicitudin sed velit ac, ultricies viverra leo. 
      Quisque quis tortor metus. Nullam hendrerit, lacus placerat elementum lacinia,
       metus enim lacinia eros, vel malesuada ante nibh nec magna. Donec ante risus, 
       porttitor nec iaculis suscipit, efficitur vitae felis. 
       Aenean ut eros nec magna bibendum tincidunt. 
       Aenean eleifend ante vel condimentum suscipit. 
       In quis ipsum eget est ornare placerat.
        Morbi massa mi, mollis sit amet risus eget, porttitor rhoncus nisi.
    `,
    email: 'mail@example.com',
    episodes: [{
      showId: 1,
      showName: 'Lorem Ipsum Hour',
      episode: {
        id: 1,
        name: 'Episode title here',
        onAirAt: moment('6-29-2018 15:00'),
        offAirAt: moment('6-29-2018 16:30'),
        audioUrl: 'https://live2.takomaradio.org/audio/sr_archive_zrStZTwZxX_16571_2018_06_24_08_00_00.m4a',
        description: 'Lorum ipsum for an hour'
      }
    }]
  });
}
