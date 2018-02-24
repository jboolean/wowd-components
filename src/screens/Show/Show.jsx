// @flow
import * as React from 'react';

import PlayButton from 'components/PlayButton';
import type { EpisodeSummary } from 'util/Types';
import type { Show as ShowType } from 'util/Types';

import { Link } from 'react-router-dom';

type Props = {
  show: ShowType
};

export default class Show extends React.Component<Props> {
  renderEpisode(episode : EpisodeSummary) {
    if (!episode.id) {
      throw new Error('id cannot be null');
    }
    const url = `/shows/${this.props.show.id}/${episode.id}`;
    return (
      <div>
        {episode.track ? <PlayButton
          track={episode.track}
          theme="dark"
          size="large"
        /> : null}
        <Link to={url}>{episode.onAirAt.format('dddd, MMMM Do')}</Link>
      </div>
    );
  }

  render() {
    const { show } = this.props;
    return (
      <div>
        <div>
          <h1>{show.name}</h1>
          <p>{show.description}</p>
        </div>
        <ol>
          {show.episodes.map(episode =>
            <li key={episode.id}>{this.renderEpisode(episode)}</li>
          )}
        </ol>
      </div>
    );
  }
}