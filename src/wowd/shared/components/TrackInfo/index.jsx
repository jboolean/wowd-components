// @flow

import * as React from 'react';

import TrackInfo from './TrackInfo';
import type { Playhead } from './TrackInfo';

import type { TrackMetadata } from 'utils/Types';

import Track from 'TrackManager/Track';

type Props = {
  track: Track<TrackMetadata>
};

type State = {
  playhead: Playhead,
  metadata: TrackMetadata,
  boundListeners: {}
};

export default class ConnectedTrackInfo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { track } = props;

    this.state = {
      playhead: {
        position: track.position,
        duration: track.duration,
      },
      boundListeners: {},
      metadata: track.metadata
    };

  }

  componentDidMount() {
    this.bindEvents(this.props.track);
  }

  componentWillUnmount() {
    this.unbindEvents();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.track !== nextProps.track) {
      this.unbindEvents();
      this.bindEvents(nextProps.track);
      this.setState({ metadata: nextProps.track.metadata });
    }
  }

  bindEvents(track: Track<TrackMetadata>) {
    const newListeners = {
      metadataChanged: (newMetadata) => this.setState({ metadata: newMetadata }),
      durationChanged: (duration) => this.setState({ playhead: {
        position: this.state.playhead.position,
        duration } }),
      positionChanged: (position) => this.setState({ playhead: {
        position: position,
        duration: this.state.playhead.duration } }),
    };

    for (const name in newListeners) {
      track.on(name, newListeners[name]);
    }
    this.setState({
      boundListeners: newListeners
    });
  }

  unbindEvents() {
    for (const name in this.state.boundListeners) {
      this.props.track.removeListener(name, this.state.boundListeners[name]);
    }
    this.setState({
      boundListeners: {}
    });
  }

  render() {
    return <TrackInfo {...this.state} />;
  }
}