// @flow
import * as React from 'react';
import ConnectedPlayButton from 'components/Player/ConnectedPlayButton';
import type { ShowAiring as ShowAiringType } from 'util/Types';
import stylesheet from './ShowList.less';


type Props = {
  airing: ShowAiringType
};

export default class ShowAiring extends React.Component<Props> {
  render() {
    const { airing } = this.props;
    return (
      <div>
        <ConnectedPlayButton
          track={this.props.airing.track}
          theme="dark"
          size="small"
          className={stylesheet.playButton}
        />
        <span>{airing.onAirAt.format('dddd, MMMM Do')}</span>
      </div>
    );
  }
}