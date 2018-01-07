// @flow

import * as React from 'react';
import { getAllShows } from 'util/ShowArchivesApi';
import collateByShow from 'util/collateByShow';
import type { Show } from 'util/Types';
import Archives from './Archives';

type State = {
  shows: ?Show[]
};

export default class ArchivesApp extends React.Component<void, State> {
  constructor(props : void) {
    super(props);
    this.state = {
      shows: null,
    };
  }

  componentDidMount() {
    getAllShows()
      .then(resp => collateByShow(resp.data))
      .then(shows => {
        this.setState({ shows });
      })
      .catch(err => console.error(err));
  }
  render() {
    if (!this.state.shows) {
      return null;
    }

    return (
      <Archives shows={this.state.shows} />
    );
  }
}