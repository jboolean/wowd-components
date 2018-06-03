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
  dayStartsAt: LocalTime,
  renderBlock: React.ComponentType<{block: BlockData<T>}>,
  dayClassName?: string,
  dayNamesClassName?: string,
  activeDayNameClassName?: string
};

export default class ConnectedSchedule<T> extends React.Component<Props<T>> {
  render() {
    const { events, timeAccessor } = this.props;
    const schedule = buildSchedule(events, timeAccessor);
    return <Schedule {...this.props} blocks={schedule} />;
  }
}

export type { timeAccessorType as timeAccessor };