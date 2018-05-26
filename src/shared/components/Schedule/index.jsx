// @flow
import * as React from 'react';

import buildSchedule from './buildSchedule';
import Schedule from './Schedule';
import BlockData from './Block';
import LocalTime from 'util/time/LocalTime';

import type { timeAccessor as timeAccessorType } from './buildSchedule';

type Props<T> = {
  events: T[],
  timeAccessor: timeAccessorType<T>,
  height: number,
  dayStartsAt : LocalTime,
  renderBlock: React.StatelessFunctionalComponent<BlockData<T>>,
  dayClassName?: string
};

export default class ConnectedSchedule<T> extends React.Component<Props<T>> {
  render() {
    const { events, timeAccessor } = this.props;
    const schedule = buildSchedule(events, timeAccessor);
    return <Schedule {...this.props} blocks={schedule} />;
  }
}