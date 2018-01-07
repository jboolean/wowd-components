// @flow
import * as React from 'react';
import typeof Track from 'TrackManager/Track';
import PlayButton from './PlayButton';
import type { Props as PlayButtonProps, Theme, Size } from './PlayButton';

type Props = {
  track : Track,
  theme : Theme,
  size : Size
};

export default class ConnectedPlayButton extends React.Component<Props, PlayButtonProps> {
  constructor(props : Props) {
    super(props);
    const { track, theme, size } = props;

    this.state = {
      state: track.state,
      onClick: () => track.play(),
      theme,
      size
    };

    track
      .on('play', () => {
        this.setState({
          onClick: () => track.pause(),
          state: track.state
        });
      })
      .on('ended', () => {
        this.setState({
          onClick: () => track.play(),
          state: track.state
        });
      })
      .on('pause', () => {
        this.setState({
          onClick: () => track.play(),
          state: track.state
        });
      });
  }

  render() {
    return <PlayButton {...this.state} />;
  }
}