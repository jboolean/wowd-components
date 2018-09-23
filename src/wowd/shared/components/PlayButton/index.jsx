// @flow
import * as React from 'react';
import Track from 'TrackManager/Track';
import PlayButton from './PlayButton';
import type { Props as PlayButtonProps, Theme, Size } from './PlayButton';

type Props = {
  track: Track<any>,
  theme: Theme,
  size: Size,
  className?: string
};

type ExtraState = {
  boundListeners: {}
};

export default class ConnectedPlayButton extends React.Component<Props, PlayButtonProps & ExtraState> {
  constructor(props: Props) {
    super(props);
    const { track, theme, size } = props;

    this.state = {
      state: track.state,
      onClick: () => track.play(),
      theme,
      size,
      boundListeners: {},
      className: props.className,
      pauseable: !track.metadata.isLive
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
        state: nextProps.track.state,
        onClick: nextProps.track.play,
        pauseable: !nextProps.track.metadata.isLive
      });
    }
  }

  bindEvents(track: Track<any>) {
    const newListeners = {
      play: () => {
        this.setState({
          onClick: () => {
            // If this is a live stream, stop instead of pause
            if (track.duration === Infinity) {
              track.stop();
              return;
            }
            track.pause();
          },
          state: track.state
        });
      },
      load: () => {
        this.setState({
          state: track.state
        });
      },
      ended: () => {
        this.setState({
          onClick: () => track.play(),
          state: track.state
        });
      },
      pause: () => {
        this.setState({
          onClick: () => track.play(),
          state: track.state
        });
      },
      prerollPlay: () => {
        this.setState({
          onClick: () => track.stop(),
          state: 'loading'
        });
      }
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
    return <PlayButton {...this.state} />;
  }
}