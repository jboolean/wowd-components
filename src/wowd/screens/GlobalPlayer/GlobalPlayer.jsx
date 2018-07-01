// @flow
import * as React from 'react';
import stylesheet from './GlobalPlayer.less';

import Track from 'TrackManager/Track';

import TrackInfo from 'components/TrackInfo';
import PlayButton from 'components/PlayButton';
import type { TrackMetadata } from 'utils/Types';

type Props = {
  track: Track<TrackMetadata>
};

export default class GlobalPlayer extends React.Component<Props> {

  render() {
    return (
      <div className={stylesheet.container}>
        <div className={stylesheet.playButtonContainer}>
          <PlayButton track={this.props.track} theme="light" size="large" />
        </div>
        <TrackInfo track={this.props.track} />
      </div>
    );
  }

}