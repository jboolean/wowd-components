// @flow
import * as React from 'react';

import PlayButton from 'components/PlayButton';
import SongPreview from 'components/SongPreview';
import type {
  Show as ShowType,
  EpisodeSummary,
  Playlist,
  PlaylistItem as PlaylistItemType } from 'util/Types';

import { Link } from 'react-router-dom';

import stylesheet from './Episode.less';

type Props = {
  show: ShowType,
  episode: EpisodeSummary,
  playlist: ?Playlist
};

const PlaylistItem = (item: PlaylistItemType) => {
  return (
    <div className={stylesheet.playlistItem}>
      <div className={stylesheet.airedOn}>
        <time dateTime={item.airedOn.format()}>{item.airedOn.format('h:mma')}</time>
      </div>
      <div className={stylesheet.previewContainer}>
        <SongPreview song={item.song} className={stylesheet.preview} />
      </div>
      <div className={stylesheet.songName}>{item.song.name}</div>
      <div className={stylesheet.songArtist}>{item.song.artist}</div>
      <div className={stylesheet.songAlbum}>{item.song.album}</div>
    </div>
  );
};

export default class Episode extends React.Component<Props> {
  render() {
    const { show, episode, playlist } = this.props;
    const date = (<time dateTime={episode.onAirAt.format()}>
      {episode.onAirAt.format('dddd, LL')}
    </time>);
    const hasTitle = !!episode.name;
    return (
      <div className="paddedPageContent">
        <div>
          <h1>{hasTitle ? episode.name : date}</h1>
          <Link to={`/${show.id}`} className={stylesheet.showName}>{show.name}</Link>
          {hasTitle ? <div className={stylesheet.airDate}>{date}</div> : null}
          {episode.track ?
            <PlayButton className={stylesheet.play} track={episode.track} theme="primary" size="large" /> :
            null}
          <p className={stylesheet.episodeDescription}>{episode.description}</p>
        </div>
        {playlist ? <ol className={stylesheet.playlist}>
          {playlist.songs.map(playlistItem =>
            <li key={playlistItem.id}><PlaylistItem {...playlistItem} /></li>
          )}
        </ol> : null}
      </div>
    );
  }
}