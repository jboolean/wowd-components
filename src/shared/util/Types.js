//@flow

import moment from 'moment';
import Track from 'TrackManager/Track';


export type Dj = {
  id: number,
  name: string,
  imageUrl: ?string
};

export type TrackMetadata = {
  showName: string,
  djs: Dj[],

  song: ?{
    name: string,
    artist: string,
    album: string
  },
  isLive: boolean,
  onAirAt: ?moment
};

export type ShowEpisode = {
  onAirAt: moment,
  offAirAt: moment,
  audioUrl: string,
  track : Track<TrackMetadata>
};

export type Show = {
  id: number,
  description: string,
  name: string,
  djs: Dj[],
  episodes: ShowEpisode[]
};