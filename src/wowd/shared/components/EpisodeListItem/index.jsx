// @flow
import * as React from 'react';

import PlayButton from 'components/PlayButton';
import type { EpisodeSummary } from 'utils/Types';

import Link from 'components/AppLink';

type Props = {
  episode: EpisodeSummary,
  showId: number,
  showName?: string
};

import stylesheet from './EpisodeListItem.less';

export default class EpisodeListItem extends React.Component<Props> {
  render() {
    const episode = this.props.episode;
    if (!episode.id) {
      throw new Error('id cannot be null');
    }
    const url = `/shows/${this.props.showId}/episodes/${episode.id}`;
    const date = (<time dateTime={episode.onAirAt.format()}>
      {episode.onAirAt.format('LL')}
    </time>);
    const hasTitle = !!episode.name;
    return (
      <div className={stylesheet.episode}>
        <div className={stylesheet.title}>
          <Link to={url}>{hasTitle ? episode.name : date}</Link>
        </div>
        {this.props.showName ? <div className={stylesheet.show}>
          <Link to={`/shows/${this.props.showId}`}>{this.props.showName}</Link>
        </div> : null}
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
}