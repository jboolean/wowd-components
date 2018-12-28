// @flow

import * as React from 'react';

import TrackInfo from './TrackInfo';
import type { Playhead } from './TrackInfo';
import type { TrackMetadata } from 'utils/Types';

import Track from 'TrackManager/Track';
import { getFurthestPosition } from 'LastPositionRepository';

type Props = {
  track: Track<TrackMetadata>
};

type State = {
  boundListeners: {},
  metadata: TrackMetadata,
  playhead: Playhead,
  resumePosition: number,
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
      metadata: track.metadata,
      resumePosition: getFurthestPosition(track) || 0
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
      this.setState({
        metadata: nextProps.track.metadata,
        resumePosition: getFurthestPosition(nextProps.track) || 0
      });
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
    const skipToResumePosition = () => this.props.track.seek(this.state.resumePosition);
    return <TrackInfo {...this.state} skipToResumePosition={skipToResumePosition} />;
  }
}