// @flow
import * as React from 'react';

import PlayButton from 'components/PlayButton';
import type { EpisodeSummary } from 'utils/Types';
import type { Show as ShowType } from 'utils/Types';
import moment from 'moment';
import cx from 'classnames';

import { Link } from 'react-router-dom';

type Props = {
  show: ShowType
};

import stylesheet from './Show.less';

const formatAirTime = (airTime: {onAirAt: moment, offAirAt: moment}): string =>
  (airTime.onAirAt.format('dddd[s], h:mma') + '–' + airTime.offAirAt.format('h:mma'))
    .replace(/:00/g, '');

const URL_SUMMARY = /^https?:\/\/(?:www.)?(.*)/;
const summarizeUrl = (url: string): string => {
  const matchResult = url.match(URL_SUMMARY);
  return matchResult ? matchResult[1] : url;
};

export default class Show extends React.Component<Props> {
  renderEpisode(episode: EpisodeSummary) {
    if (!episode.id) {
      throw new Error('id cannot be null');
    }
    const url = `/${this.props.show.id}/episodes/${episode.id}`;
    const date = (<time dateTime={episode.onAirAt.format()}>
      {episode.onAirAt.format('LL')}
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
              theme="primary"
              size="small"
            />
          </div> : null}
          {episode.hasPlaylist ? <Link to={url} className={stylesheet.playlistButton}>
            Playlist
          </Link> : null}
        </div>
      </div>
    );
  }

  render() {
    const { show } = this.props;
    return (
      <div className={cx(stylesheet.container, 'paddedPageContent')}>
        <div>
          <h1>{show.name}</h1>
          <div className={stylesheet.showInfo}>
            {show.imageUrl ?
              <img className={stylesheet.image} src={show.imageUrl} /> :
              null}
            <div className={stylesheet.djs}>
              {show.djs.map(dj =>
                <span key={dj.id} className={stylesheet.dj}>{dj.name}</span>
              )}
            </div>
            <div className={stylesheet.airTimes}>
              {show.airTimes.map(formatAirTime).join(', ')}
            </div>
            <p className={stylesheet.showDescription}>{show.description}</p>
            {show.externalUrl ?
              <a
                className={stylesheet.externalUrl}
                target="_blank"
                href={show.externalUrl}>
                {summarizeUrl(show.externalUrl)}
              </a> : null
            }
          </div>
        </div>
        {show.episodes ?
          <ol className={stylesheet.episodes}>
            {show.episodes.map(episode =>
              <li key={episode.id}>{this.renderEpisode(episode)}</li>
            )}
          </ol> : null}
        <p className={stylesheet.disclaimer}>
          {show.episodes ?
            <span>Audio is available for two weeks after the episode airs.</span> :
            <span>Archives are not available for this show. </span> }
        </p>
      </div>
    );
  }
}