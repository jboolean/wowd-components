// @flow
import * as React from 'react';
import PlayButton from 'components/PlayButton';
import type { EpisodeSummary } from 'util/Types';


type Props = {
  episode: EpisodeSummary
};

export default class ShowEpisode extends React.Component<Props> {
  render() {
    const { episode } = this.props;
    if (!episode.track) {
      throw 'Episode must have a track';
    }
    return (
      <div>
        <PlayButton
          track={episode.track}
          theme="dark"
          size="small"
        />
        <span>{episode.onAirAt.format('dddd, MMMM Do')}</span>
      </div>
    );
  }
}