// @flow
import * as React from 'react';
import ConnectedPlayButton from '../Player/ConnectedPlayButton';
import TrackManager from '../TrackManager';
import typeof Track from '../TrackManager/Track';
import type { ShowAiring as ShowAiringType } from './util/Types';
import stylesheet from './ShowList.less';

type State = {
  track : ?Track
};

type Props = {
  airing: ShowAiringType
};

export default class ShowAiring extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const track = TrackManager.createTrack(props.airing.audioUrl);
    this.state = { track };
  }

  render() {
    const { airing } = this.props;
    return (
      <div>
        <ConnectedPlayButton track={this.state.track} theme="dark" size="small" className={stylesheet.playButton}/>
        <span href={airing.audioUrl}>{airing.onAirAt.format('dddd, MMMM Do')}</span>
      </div>
    );
  }
}