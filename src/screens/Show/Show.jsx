// @flow
import * as React from 'react';

import PlayButton from 'components/PlayButton';
import type { EpisodeSummary } from 'util/Types';
import type { Show as ShowType } from 'util/Types';
import moment from 'moment';

import { Link } from 'react-router-dom';

type Props = {
  show: ShowType
};

import stylesheet from './Show.less';

const formatAirTime = (airTime : {onAirAt: moment, offAirAt: moment}) : string =>
  (airTime.onAirAt.format('dddd[s], h:mma') + '–' + airTime.offAirAt.format('h:mma'))
    .replace(/:00/g, '');



export default class Show extends React.Component<Props> {
  renderEpisode(episode : EpisodeSummary) {
    if (!episode.id) {
      throw new Error('id cannot be null');
    }
    const url = `/shows/${this.props.show.id}/${episode.id}`;
    const date = (<time dateTime={episode.onAirAt.format()}>
      {episode.onAirAt.format('dddd, MMMM Do')}
    </time>);
    const hasTitle = !!episode.name;
    return (
      <div className={stylesheet.episode}>
        <div className={stylesheet.title}>
          <Link to={url}>{hasTitle ? episode.name : date}</Link>
        </div>
        <div className={stylesheet.teaser}>
          {hasTitle ? <span className={stylesheet.inlineDate}>{date}</span> : null}
          <span className={stylesheet.description}>{episode.description}</span>
        </div>
        <div className={stylesheet.actions}>
          {episode.track ? <div className={stylesheet.play}>
            <PlayButton
              track={episode.track}
              theme="dark"
              size="small"
            />
          </div> : null}
          <Link to={url} className={stylesheet.playlistButton}>
            Playlist
          </Link>
        </div>
      </div>
    );
  }

  render() {
    const { show } = this.props;
    return (
      <div className={stylesheet.container}>
        <div>
          <h1>{show.name}</h1>
          <div className={stylesheet.showInfo}>
            <div className={stylesheet.djs}>
              {show.djs.map(dj =>
                <span key={dj.id} className={stylesheet.dj}>{dj.name}</span>
              )}
            </div>
            <div className={stylesheet.airTimes}>
              {show.airTimes.map(formatAirTime).join(', ')}
            </div>
            <p className={stylesheet.showDescription}>{show.description}</p>
          </div>
        </div>
        <ol className={stylesheet.episodes}>
          {show.episodes.map(episode =>
            <li key={episode.id}>{this.renderEpisode(episode)}</li>
          )}
        </ol>
      </div>
    );
  }
}