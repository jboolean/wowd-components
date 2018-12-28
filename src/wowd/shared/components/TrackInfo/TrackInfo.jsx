// @flow

import * as React from 'react';

import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import cx from 'classnames';
momentDurationFormatSetup(moment);

import stylesheet from './TrackInfo.less';

import type {
  TrackMetadata,
  LiveTrackMetadata,
  ArchiveTrackMetadata,
  SponsorTrackMetadata } from 'utils/Types';

export type Playhead = {
  duration: number,
  position: number
};

const formatTimestamp = (seconds) =>
  // $FlowFixMe
  moment.duration(seconds, 'seconds').format('h:*mm:ss');

const Timestamp = ({ value: seconds }: { value: number }) => {
  const string = formatTimestamp(seconds);
  // Okay so, to prevent the time text from jumping around,
  // stardard widths are defined based on the string length.
  const className = cx(stylesheet.timestamp, {
    [stylesheet.singleMinutes]: string.length === 4,
    [stylesheet.tensOfMinutes]: string.length === 5,
    [stylesheet.hours]: string.length === 7,
    [stylesheet.veryLong]: string.length > 7
  });
  return <span className={className}>{string}</span>;
};

function PosititonIndicator(props: { playhead: Playhead, resumePosition?: number, skipToResumePosition?: () => void}) {
  const { playhead, resumePosition, skipToResumePosition } = props;
  return (
    <div>
      <Timestamp value={playhead.position} /> / <Timestamp value={playhead.duration} />&nbsp;
      {resumePosition && skipToResumePosition && resumePosition > playhead.position ? (
        <a onClick={skipToResumePosition} className={stylesheet.resume}>
          <span className={stylesheet.ffIcon}>▸▸︎</span> Resume from <Timestamp value={resumePosition} / >
        </a>
      ) : null}
    </div>
  );
}

function LiveTrackInfo(props: { metadata: LiveTrackMetadata }) {
  const { metadata } = props;

  return (
    <div className={stylesheet.container}>

      <div className={stylesheet.heading}>On Air</div>

      <div className={stylesheet.show}>
        <span>{metadata.showName}</span>
        {metadata.djs.length ? <span className={stylesheet.djs}>
        &nbsp;(
          {metadata.djs.map((dj) => (
            <span key={dj.id} className={stylesheet.dj}>{dj.name}</span>
          ))}
        )
        </span> : null}
        {metadata.song ?
          <div>
            <span>{metadata.song.artist}</span>,
          &lsquo;<span>{metadata.song.name}</span>&rsquo;
            {/*<div>{metadata.song.album}</div>*/}
          </div> : null}
      </div>
    </div>
  );
}

function ArchiveTrackInfo(props: {
   metadata: ArchiveTrackMetadata, playhead: Playhead, resumePosition: number, skipToResumePosition: () => void }) {
  const { metadata, playhead, resumePosition, skipToResumePosition } = props;
  return (
    <div className={stylesheet.container}>
      {metadata.onAirAt ? <div>{metadata.onAirAt.format('dddd, MMMM Do, YYYY')}</div> : null}
      <div className={stylesheet.show}>
        <span>{metadata.showName}</span>
        {metadata.djs.length ? <span className={stylesheet.djs}>
        &nbsp;(
          {metadata.djs.map((dj) => (
            <span key={dj.id} className={stylesheet.dj}>{dj.name}</span>
          ))}
        )
        </span> : null}
      </div>
      <PosititonIndicator
        playhead={playhead}
        resumePosition={resumePosition}
        skipToResumePosition={skipToResumePosition}
      />
    </div>
  );
}

function SponsorTrackInfo(props: { metadata: SponsorTrackMetadata, playhead: Playhead }) {
  const { metadata, playhead } = props;

  return (
    <div className={stylesheet.container}>
      <div className={stylesheet.show}>
        {metadata.showSponsorImg ?
          <a href={metadata.showSponsorUrl} target="_blank">
            <img src={metadata.showSponsorImg} />
          </a> : null}
        <span>{metadata.showSponsorText}</span>
        <span><a href={metadata.showSponsorUrl} target="_blank">{metadata.showSponsorName}</a></span>
      </div>
      <PosititonIndicator playhead={playhead} />
    </div>
  );
}


function StationIdTrackInfo(props: { playhead: Playhead }) {
  const { playhead } = props;

  return (
    <div className={stylesheet.container}>
      <div className={stylesheet.show}>
        <span>Takoma Radio • WOWD-LP • 94.3 FM</span>
      </div>
      <PosititonIndicator playhead={playhead} />
    </div>
  );
}


export default function TrackInfo(props: {
  metadata: TrackMetadata, playhead: Playhead, resumePosition?: number, skipToResumePosition: () => void
}) {
  const { metadata, playhead, resumePosition, skipToResumePosition } = props;
  if (metadata.isLive) {
    return <LiveTrackInfo metadata={metadata} />;
  } else if (metadata.isArchive) {
    return (<ArchiveTrackInfo
      metadata={metadata}
      playhead={playhead}
      resumePosition={resumePosition || 0}
      skipToResumePosition={skipToResumePosition}
    />);
  } else if (metadata.isSponsor) {
    return <SponsorTrackInfo metadata={metadata} playhead={playhead} />;
  } else if (metadata.isStationId) {
    return <StationIdTrackInfo playhead={playhead} />;
  }
  throw new Error('Unknown track metadata type');
}