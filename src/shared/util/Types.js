//@flow

import moment from 'moment';
import typeof Track from 'TrackManager/Track';

export type Dj = {
  id: number,
  name: string,
  imageUrl: ?string
};

export type ShowEpisode = {
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
  episodes: ShowEpisode[]
};
