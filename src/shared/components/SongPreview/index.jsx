// @flow
import * as React from 'react';
import type { Song } from 'util/Types';
import { findSongUri } from 'util/SpotifyApi';
import cx from 'classnames';

type Props = {
  song: Song,
  className?: string
};

type State = {
  uri : ?string
};


export default class SongPreview extends React.Component<Props, State> {
  constructor(props : Props) {
    super(props);
    this.state = { uri: null };
  }
  componentDidMount() {
    findSongUri(this.props.song)
      .then(uri => this.setState({ uri }))
      .catch(e => console.error('Searching spotify failed', e));
  }

  render() {
    const { uri } = this.state;
    if (!uri) {
      return null;
    }
    return (<iframe
      className={cx(this.props.className)}
      src={'https://open.spotify.com/embed?uri=' + uri}
      frameBorder="0"
      // eslint-disable-next-line react/no-unknown-property
      allowtransparency="true"
      allow="encrypted-media" />);

  }
}