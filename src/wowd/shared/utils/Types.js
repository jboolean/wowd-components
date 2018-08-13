//@flow

import moment from 'moment';
import Track from 'TrackManager/Track';
import Alternations from './Alternations';

export type DjSummary = {
  id: ?number,
  name: string,
  imageUrl: ?string
};

export type Song = {
  name: string,
  artist: string,
  album: string
};

export type TrackMetadata = {
  showName: string,
  djs: DjSummary[],

  song: ?Song,
  isLive: boolean,
  onAirAt: ?moment
};

/**
 * This object is used in two different contexts.
 * Depending on from whence a Show is retrieved, the id may or may be available.
 * From the archive summary: id, name, and description are null.
 * From the show info api: id is available, and name and description are nullable.
 */
export type EpisodeSummary = {
  id: ?string,
  name: ?string,
  description: ?string,

  onAirAt: moment,
  offAirAt: moment,
  audioUrl: ?string,
  track: ?Track<TrackMetadata>,
  hasPlaylist: boolean
};


export type Show = {
  id: number,
  description: string,
  name: string,
  djs: DjSummary[],
  episodes: ?(EpisodeSummary[]), // if null, this show is not archived
  // These moments represent a time of week, not an instant in time.
  // moment is not ideal for this.
  airTimes: {
    onAirAt: moment,
    offAirAt: moment
  }[],
  externalUrl: ?string,
  alternationId: $Values<Alternations>,
  imageUrl: ?string
};

export type PlaylistItem = {
    id: number,
    airedOn: moment,
    song: Song
  };

export type Playlist = {
  id: number,
  songs: PlaylistItem[]
};

export type Dj = {
  id: ?number,
  name: string,
  imageUrl: ?string,
  email: ?string,
  website: ?string,
  description: ?string,
  episodes: {
    showId: number,
    showName: string,
    episode: EpisodeSummary
  }[]
};

