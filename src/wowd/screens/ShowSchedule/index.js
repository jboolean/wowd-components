// @flow

import * as React from 'react';

import type { Show } from 'utils/Types';
import { getAllShows } from 'utils/ShowArchivesApi';
import ShowSchedule from './ShowSchedule';

let promise;
// Fetch, transform, and cache archive summary
const getArchiveSummaries = (): Promise<Show[]> => {
  if (!promise) {
    promise = getAllShows();
  }
  return promise;
};
type State = {
  shows: ?Show[],
};

export default class ConnectedShowSchedule extends React.Component<void, State> {
  constructor(props: void) {
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
      <ShowSchedule
        shows={this.state.shows}
      />

    );
  }
}