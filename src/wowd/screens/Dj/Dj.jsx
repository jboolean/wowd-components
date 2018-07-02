// @flow
import * as React from 'react';

import EpisodeListItem from 'components/EpisodeListItem';
import type { Dj as DjType } from 'utils/Types';
import cx from 'classnames';

type Props = {
  dj: DjType
};

import stylesheet from './Dj.less';

const URL_SUMMARY = /^https?:\/\/(?:www.)?(.*)/;
const summarizeUrl = (url: string): string => {
  const matchResult = url.match(URL_SUMMARY);
  return matchResult ? matchResult[1] : url;
};

export default class Dj extends React.Component<Props> {
  render() {
    const { dj } = this.props;
    return (
      <div className={cx(stylesheet.container, 'paddedPageContent')}>
        <div>
          <h1>{dj.name}</h1>
          <div className={stylesheet.djInfo}>
            {dj.imageUrl ?
              <img className={stylesheet.image} src={dj.imageUrl} /> :
              null}
            <p className={stylesheet.djDescription}>{dj.description}</p>
            {dj.website ?
              <div><a
                target="_blank"
                href={dj.website}>
                {summarizeUrl(dj.website)}
              </a></div> : null
            }
            {dj.email ?
              <div><a
                target="_blank"
                href={`mailto:${encodeURI(dj.email)}`}>
                {dj.email}
              </a></div> :
              null}
          </div>
        </div>
        <h2>Recent shows</h2>
        <ol className={stylesheet.episodes}>
          {dj.episodes.map(({ showId, showName, episode }) =>
            (<li key={episode.id}>
              <EpisodeListItem showId={showId} showName={showName} episode={episode} />
            </li>)
          )}
        </ol>
      </div>
    );
  }
}