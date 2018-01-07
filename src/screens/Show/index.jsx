// @flow
import * as React from 'react';

import Show from './Show';

import type { ContextRouter } from 'react-router-dom';
import type { Show as ShowType } from 'util/Types';

export default class ConnectedShow extends React.Component<ContextRouter> {
  render() {
    const showId = parseInt(this.props.match.params.showId);
    if (!showId) {
      return null;
    }
    const show : ShowType = {
      id: showId,
      name: 'Show #' + showId,
      description: 'Fetching show data not implemented',
      djs: [],
      airings: []
    };
    return (
      <Show show={show}/>
    );
  }
}