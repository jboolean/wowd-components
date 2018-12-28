// @flow
import * as React from 'react';

import GlobalPlayer from './GlobalPlayer';
import Track from 'TrackManager/Track';
import type { TrackMetadata } from 'utils/Types';

import TrackManagerSingleton from 'TrackManager';
import TrackManagerType from 'TrackManager/TrackManager';

const TrackManager = (TrackManagerSingleton: TrackManagerType<TrackMetadata>);

type State = {
  track: ?Track<TrackMetadata>
};

export default class ConnectedGlobalPlayer extends React.Component<void, State> {
  trackChangeListener: (track: Track<TrackMetadata>) => void;
  constructor() {
    super();

    this.state = {
      track: TrackManager.activeTrack,
    };

    this.trackChangeListener = (track) => {
      this.setState({ track });
    };
  }

  componentDidMount() {
    this.bindEvents();
  }

  componentWillUnmount() {
    this.unbindEvents();
  }

  bindEvents() {
    TrackManager.on('trackChanged', this.trackChangeListener);
  }

  unbindEvents() {
    TrackManager.removeListener('trackChanged', this.trackChangeListener);
  }

  render() {
    if (this.state.track) {
      const track = this.state.track;
      return <GlobalPlayer track={track} />;
    }
    return null;
  }
}