// @flow
import axios from 'axios';

import Track from 'TrackManager/Track';
import moment from 'moment';
import type { Show, EpisodeSummary, DjSummary, Dj, ArchiveTrackMetadata, TrackMetadata, Playlist } from './Types';
import Alternations from 'utils/Alternations';
import TrackManagerSingleton from 'TrackManager';
import TrackManagerType from 'TrackManager/TrackManager';
const TrackManager = (TrackManagerSingleton: TrackManagerType<TrackMetadata>);
import every from 'lodash/every';

// prevents duplicate Tracks from being created.
const trackCatalog : {[string]: Track<TrackMetadata>} = {};

const getOrCreateTrack =
  (url: string, metadata: TrackMetadata, preroll?: ?Track<TrackMetadata>): Track<TrackMetadata> => {
    if (!(url in trackCatalog)) {
      trackCatalog[url] = TrackManager.createTrack(url, metadata, preroll);
    }
    return trackCatalog[url];
  };

const convertTime = (date: string, time: string): moment =>
  moment(date + ' ' + time, 'YYYY-MM-DD HH:mm');

const convertTimeOfWeek = (dayOfWeek: string, time: string): moment =>
  moment(dayOfWeek + ' ' + time, 'ddd HH:mm');

const convertPrerollMetadata = (apiSponsorInfo: *): TrackMetadata => {
  if (every(apiSponsorInfo, (field) => field === null)) {
    return {
      isStationId: true
    };
  }
  return {
    isSponsor: true,
    showSponsorName: apiSponsorInfo.showSponsorName,
    showSponsorImg: apiSponsorInfo.showSponsorImg,
    showSponsorText: apiSponsorInfo.showSponsorText,
    showSponsorUrl: apiSponsorInfo.showSponsorUrl
  };

};

const convertEpisodeSummary = (apiEpisode: *, apiShow: *): EpisodeSummary => {
  const onAirAtStr = apiEpisode.onAirAt || apiShow.onAirAt;
  const offAirAtStr = apiEpisode.offAirAt || apiShow.offAirAt;
  const onAirAt = convertTime(apiEpisode.date, onAirAtStr);
  const offAirAt = convertTime(apiEpisode.date, offAirAtStr);
  const audioUrl = apiEpisode.audioUrl;
  const metadata : ArchiveTrackMetadata = {
    isArchive: true,

    showName: apiShow.name,
    djs: apiShow.djs,
    onAirAt
  };
  let preroll = null;
  if (apiEpisode.sponsorPrerollAudioUrl) {
    preroll = getOrCreateTrack(apiEpisode.sponsorPrerollAudioUrl, convertPrerollMetadata(apiShow.sponsorInfo));
  }
  const track = audioUrl !== null ? getOrCreateTrack(audioUrl, metadata, preroll) : null;
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
  const showsById: { [number]: Show } = {};
  // Convert each show,
  // if it is a duplicate, merge the air times.
  for (const apiShow of apiShows) {
    const show = convertShow(apiShow);
    if (show.id in showsById) {
      const conflictingShow = showsById[show.id];
      Array.prototype.push.apply(conflictingShow.airTimes, show.airTimes);
    } else {
      showsById[show.id] = show;
    }
  }
  //$FlowFixMe flow simply does not support types with Object.values for reasons :-(
  const results: Show[] = Object.values(showsById);
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

const convertDj = (apiDj: *): Dj => {
  return {
    id: apiDj.info.id,
    name: apiDj.info.name || 'DJ #' + apiDj.info.id,
    imageUrl: apiDj.info.imageUrl,
    website: apiDj.info.web,
    description: apiDj.info.description,
    email: apiDj.info.email,
    episodes: (apiDj.episodes || []).map((apiDjEpisode) => {
      const audioUrl = apiDjEpisode.audioUrl;
      const onAirAt = convertTime(apiDjEpisode.date, apiDjEpisode.onAirAt || '12:00');
      const offAirAt = convertTime(apiDjEpisode.date, apiDjEpisode.offAirAt || '12:00');
      const metadata : ArchiveTrackMetadata = {
        isArchive: true,
        showName: apiDjEpisode.showName,
        djs: [apiDj],
        onAirAt
      };
      const track = audioUrl !== null ? getOrCreateTrack(audioUrl, metadata) : null;
      return {
        showId: apiDjEpisode.showId,
        showName: apiDjEpisode.showName,
        episode: {
          id: apiDjEpisode.id,
          onAirAt,
          offAirAt,
          audioUrl: apiDjEpisode.audioUrl,
          track,
          name: apiDjEpisode.name,
          description: apiDjEpisode.description,
          hasPlaylist: false
        }
      };
    })
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
  return axios.get(ROOT_URL, { params: { request: 'djinfo', id: djId } })
    .then(resp => {
      return convertDj(resp.data);
    }, (err) => {
      if (err.response.status === 404) {
        return null;
      }
      throw err;
    });
}
