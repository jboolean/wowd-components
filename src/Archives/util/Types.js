//@flow

import moment from 'moment';
import typeof Track from '../../TrackManager/Track';

export type Dj = {
  id: number,
  name: string,
  imageUrl: ?string
};

export type ShowAiring = {
  onAirAt: moment,
  offAirAt: moment,
  audioUrl: string,
  track : Track
};

export type Show = {
  id: number,
  description: string,
  name: string,
  djs: Dj[],
  airings: ShowAiring[]
};

export type Airing = {
  showId: number,
  showDescription: string,
  showName: string,
  onAirAt: moment,
  offAirAt: moment,
  showDescription: string,
  audioUrl: string,
  djs: Dj[]
};
