// @flow
import * as React from 'react';
import PlayButton from 'components/PlayButton';
import type { ShowEpisode as ShowEpisodeType } from 'util/Types';
import stylesheet from './ShowList.less';


type Props = {
  episode: ShowEpisodeType
};

export default class ShowEpisode extends React.Component<Props> {
  render() {
    const { episode } = this.props;
    return (
      <div>
        <PlayButton
          track={this.props.episode.track}
          theme="dark"
          size="small"
          className={stylesheet.playButton}
        />
        <span>{episode.onAirAt.format('dddd, MMMM Do')}</span>
      </div>
    );
  }
}