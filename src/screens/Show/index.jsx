// @flow
import * as React from 'react';

import Show from './Show';

import type { ContextRouter } from 'react-router-dom';
import type { Show as ShowType } from 'util/Types';

const ConnectedShow = (props : ContextRouter) => {
  const showId = parseInt(props.match.params.showId);
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
};

export default ConnectedShow;