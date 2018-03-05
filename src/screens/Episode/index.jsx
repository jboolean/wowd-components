// @flow
import * as React from 'react';

import Episode from './Episode';

import type { ContextRouter } from 'react-router-dom';
import type { Show as ShowType, EpisodeSummary, Playlist as PlaylistType } from 'util/Types';

import { getShow, getPlaylist } from 'util/ShowArchivesApi';

type State = {
  show: ?ShowType,
  episode: ?EpisodeSummary,
  playlist: ?PlaylistType
};

export default class ConnectedEpisode extends React.Component<ContextRouter, State> {
  constructor(props : void) {
    super(props);
    this.state = {
      show: null,
      episode: null,
      playlist: null
    };
  }

  componentDidMount() {
    const showId = parseInt(this.props.match.params.showId);
    const episodeId = this.props.match.params.episodeId;
    if (!episodeId) {
      throw new Error('Missing episode id in params');
    }
    Promise.all([getShow(showId), getPlaylist(episodeId)])
      .then(([show, playlist]) => {
        if (!show.episodes) {
          throw new Error('Show has no episodes.');
        }
        const episode = show.episodes.find(e => e.id === episodeId);
        if (!episode) {
          throw new Error('Episode not found in show.');
        }
        this.setState({ show, episode, playlist });
      })
      .catch(err => console.error(err));
  }
  render() {
    const { show, episode, playlist } = this.state;
    if (!show || !episode) {
      return null;
    }

    return (
      <Episode show={show} episode={episode} playlist={playlist}/>
    );
  }
}