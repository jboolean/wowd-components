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
  uri : ?string,
  loaded: boolean
};


export default class SongPreview extends React.Component<Props, State> {
  constructor(props : Props) {
    super(props);
    this.state = { uri: null, loaded: false };
  }
  componentDidMount() {
    findSongUri(this.props.song)
      .then(uri => this.setState({ uri }))
      .catch(e => console.error('Searching spotify failed', e))
      .then(() => {this.setState({ loaded: true });});
  }

  render() {
    const { uri, loaded } = this.state;
    const className = cx(this.props.className);
    if (!loaded) {
      // Since it will probably load successfully,
      // take up space while loading to reduce shifting
      return (<div className={className}>
        <div style={{ width: '100%', height: '100%' }} />
      </div>);
    }
    if (!uri) {
      return null;
    }
    return (<iframe
      className={className}
      src={'https://open.spotify.com/embed?uri=' + uri}
      frameBorder="0"
      // eslint-disable-next-line react/no-unknown-property
      allowtransparency="true"
      allow="encrypted-media" />);

  }
}