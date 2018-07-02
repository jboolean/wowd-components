// @flow
import * as React from 'react';

import Dj from './Dj';

import type { ContextRouter } from 'react-router-dom';
import type { Dj as DjType } from 'utils/Types';

import { getDj } from 'utils/ShowArchivesApi';

type State = {
  dj: ?DjType
};

export default class ConnectedDj extends React.Component<ContextRouter, State> {
  constructor(props: void) {
    super(props);
    this.state = {
      dj: null,
    };
  }

  componentDidMount() {
    const djId = parseInt(this.props.match.params.djId);
    getDj(djId)
      .then(dj => {
        this.setState({ dj });
      })
      .catch(err => console.error(err));
  }
  render() {
    if (!this.state.dj) {
      return null;
    }

    return (
      <Dj dj={this.state.dj} />
    );
  }
}