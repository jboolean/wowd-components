// @flow

import * as React from 'react';

import TrackInfo from './TrackInfo';
import type { Playhead } from './TrackInfo';

import type { TrackMetadata } from 'utils/Types';

import Track from 'TrackManager/Track';

type Props = {
  track: Track<TrackMetadata>
};

type InternalState = {
  boundListeners: {}
};

export default class ConnectedTrackInfo extends React.Component<Props, TrackMetadata & InternalState & Playhead> {
  constructor(props: Props) {
    super(props);
    const { track } = props;

    this.state = Object.assign(
      {},
      {
        position: track.position,
        duration: track.duration,
        boundListeners: {}
      },
      track.metadata);

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
      this.setState(nextProps.track.metadata);
    }
  }

  bindEvents(track: Track<TrackMetadata>) {
    const newListeners = {
      metadataChanged: (newMetadata) => this.setState(newMetadata),
      durationChanged: (duration) => this.setState({ duration }),
      positionChanged: (position) => this.setState({ position })
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