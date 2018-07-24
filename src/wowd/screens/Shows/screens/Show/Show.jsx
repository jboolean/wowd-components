// @flow
import * as React from 'react';

import EpisodeListItem from 'components/EpisodeListItem';
import Link from 'components/AppLink';
import type { Show as ShowType } from 'utils/Types';
import moment from 'moment';
import cx from 'classnames';

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
                <Link key={dj.id} className={stylesheet.dj} to={`/djs/${dj.id}`}>{dj.name}</Link>
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
              (<li key={episode.id}>
                <EpisodeListItem showId={show.id} episode={episode} />
              </li>)
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