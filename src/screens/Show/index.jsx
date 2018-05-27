// @flow
import * as React from 'react';

import Show from './Show';

import type { ContextRouter } from 'react-router-dom';
import type { Show as ShowType } from 'util/Types';

import { getShow } from 'util/ShowArchivesApi';

type State = {
  show: ?ShowType
};

export default class ConnectedShow extends React.Component<ContextRouter, State> {
  constructor(props: void) {
    super(props);
    this.state = {
      show: null,
    };
  }

  componentDidMount() {
    const showId = parseInt(this.props.match.params.showId);
    getShow(showId)
      .then(show => {
        this.setState({ show });
      })
      .catch(err => console.error(err));
  }
  render() {
    if (!this.state.show) {
      return null;
    }

    return (
      <Show show={this.state.show} />
    );
  }
}