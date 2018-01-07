// @flow
import * as React from 'react';

import type { Show as ShowType } from 'util/Types';

type Props = {
  show: ShowType
};

export default class Show extends React.Component<Props> {
  render() {
    const { show } = this.props;
    return (
      <div>
        <h1>{show.name}</h1>
        <p>{show.description}</p>
      </div>
    );
  }
}