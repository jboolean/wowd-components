// @flow

import * as React from 'react';

import type { Show } from 'util/Types';
import Archives from './Archives';
import getArchiveSummaries from './util/getArchiveSummaries';

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
    getArchiveSummaries()
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