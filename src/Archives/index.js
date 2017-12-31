// @flow

import * as React from 'react';
import { getAllShows } from './ShowArchivesApi';
import collateByShow from './util/collateByShow';
import type { Show } from './util/Types';

import ShowList from './ShowList';

export default class ArchivesApp extends React.Component<void, {shows: ?Show[]}> {
  constructor(props : void) {
    super(props);
    this.state = {
      shows: null
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
    if (this.state.shows) {
      return <ShowList shows={this.state.shows} />;
    }
    return null;
  }
}