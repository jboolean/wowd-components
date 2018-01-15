// @flow

import * as React from 'react';

import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import cx from 'classnames';
momentDurationFormatSetup(moment);

import stylesheet from './TrackInfo.less';

import type { TrackMetadata } from 'util/Types';

export type Playhead = {
  duration: number,
  position: number
};

const formatTimestamp = (seconds) =>
  // $FlowFixMe
  moment.duration(seconds, 'seconds').format('h:*mm:ss');

const Timestamp = ({ value: seconds } : { value : number }) => {
  const string = formatTimestamp(seconds);
  const className = cx(stylesheet.timestamp, {
    [stylesheet.singleMinutes]: string.length === 4,
    [stylesheet.tensOfMinutes]: string.length === 5,
    [stylesheet.hours]: string.length === 7,
    [stylesheet.veryLong]: string.length > 7
  });
  return <span className={className}>{string}</span>;
};

export default function TrackInfo(trackInfo : TrackMetadata & Playhead) {

  return (
    <div className={stylesheet.container}>
      {trackInfo.isLive ?
        <div className={stylesheet.heading}>On Air</div> :
        trackInfo.onAirAt ? <div>{trackInfo.onAirAt.format('dddd, MMMM Do, YYYY')}</div> : null
      }
      <div className={stylesheet.show}>
        <span>{trackInfo.showName}</span>
        {trackInfo.djs.length ? <span className={stylesheet.djs}>
        &nbsp;(
          {trackInfo.djs.map((dj) => (
            <span key={dj.id} className={stylesheet.dj}>{dj.name}</span>
          ))}
        )
        </span> : null}
      </div>
      {trackInfo.song ?
        <div>
          <span>{trackInfo.song.artist}</span>,
          &lsquo;<span>{trackInfo.song.name}</span>&rsquo;
          {/*<div>{trackInfo.song.album}</div>*/}
        </div> : null}
      {!trackInfo.isLive ? <div>
        <Timestamp value={trackInfo.position}/> / <Timestamp value={trackInfo.duration}/>
      </div> : null}
    </div>
  );
}