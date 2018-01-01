// @flow

import * as React from 'react';

import stylesheet from './TrackInfo.less';

type TrackInfoType = {
  showName : string,
  djNames: string[],
  track : ?{
    artist : string,
    song : string,
    album : string
  },
  currentTime : ?number,
  totalTime : ?number,
  isLive : boolean
};

export default function TrackInfo(trackInfo : TrackInfoType) {

  return (
    <div>
      {trackInfo.isLive &&
        <div className={stylesheet.heading}>On Air</div>}
      <div className={stylesheet.show}>
        <span>{trackInfo.showName}</span>
        {trackInfo.djNames.length && (<span>{trackInfo.djNames.join(' & ')}</span>)}
      </div>
      {trackInfo.track &&
        <div>
          <span>{trackInfo.track.artist}</span>,
          &lsquo;<span>{trackInfo.track.song}</span>&rsquo;
          <div>{trackInfo.track.album}</div>
        </div>}
    </div>
  );
}