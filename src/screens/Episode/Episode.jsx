// @flow
import * as React from 'react';

import PlayButton from 'components/PlayButton';
import type {
  Show as ShowType,
  EpisodeSummary,
  Playlist,
  PlaylistItem as PlaylistItemType } from 'util/Types';

type Props = {
  show: ShowType,
  episode: EpisodeSummary,
  playlist: Playlist
};

const PlaylistItem = (item : PlaylistItemType) => {
  return (
    <div>
      <div>{item.airedOn.format()}</div>
      <div>{item.song.name}</div>
      <div>{item.song.artist}</div>
      <div>{item.song.album}</div>
    </div>
  );
};

export default class Episode extends React.Component<Props> {
  render() {
    const { show, episode, playlist } = this.props;
    return (
      <div>
        <div>
          {episode.name ?
            <div>
              <h2>{episode.onAirAt.format('dddd, MMMM Do')}</h2>
              <h1>{episode.name}</h1>
            </div> :
            <h1>{episode.onAirAt.format('dddd, MMMM Do')}</h1>}
          <h2>{show.name}</h2>
          <p>{episode.description}</p>
        </div>
        {episode.track ? <PlayButton track={episode.track} theme="dark" size="large" /> : null}
        <ol>
          {playlist.songs.map(playlistItem =>
            <li key={playlistItem.id}><PlaylistItem {...playlistItem} /></li>
          )}
        </ol>
      </div>
    );
  }
}