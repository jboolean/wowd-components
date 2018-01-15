// @flow
import * as React from 'react';

import GlobalPlayer from './GlobalPlayer';
import Track from 'TrackManager/Track';
import type { TrackMetadata } from 'util/Types';

import TrackManagerSingleton from 'TrackManager';
import TrackManagerType from 'TrackManager/TrackManager';
const TrackManager = (TrackManagerSingleton : TrackManagerType<TrackMetadata>);

type State = {
  trackChangeListener: ?((track : Track<TrackMetadata>) => void),
  track: ?Track<TrackMetadata>
};

export default class ConnectedGlobalPlayer extends React.Component<void, State> {
  constructor() {
    super();

    this.state = {
      track: TrackManager.activeTrack,
      trackChangeListener: null
    };
  }

  componentDidMount() {
    this.bindEvents();
  }

  componentWillUnmount() {
    this.unbindEvents();
  }

  bindEvents() {

    TrackManager.on('trackChanged', (track) => {
      this.setState({ track });
    });
  }

  unbindEvents() {
    if (this.state.trackChangeListener) {
      TrackManager.removeListener('trackChanged', this.state.trackChangeListener);
    }
  }

  render() {
    if (this.state.track) {
      return <GlobalPlayer track={this.state.track} />;
    }
    return null;
  }
}