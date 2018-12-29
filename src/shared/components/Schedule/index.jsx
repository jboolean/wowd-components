// @flow
import * as React from 'react';

import buildSchedule from './buildSchedule';
import Schedule from './Schedule';
import BlockData from './Block';
import LocalTime from 'utils/time/LocalTime';
import WeeklyDayTime from 'utils/time/WeeklyDayTime';
import memoizeOne from 'memoize-one';

import type { timeAccessor as timeAccessorType } from './buildSchedule';

type Props<T> = {
  events: T[],
  timeAccessor: timeAccessorType<T>,
  height: number,
  dayStartsAt: LocalTime,
  renderBlock: React.ComponentType<{block: BlockData<T>}>,
  dayClassName?: string,
  dayNamesClassName?: string,
  activeDayNameClassName?: string,
  nowBarLineClassName?: string,
  nowBarDotClassName?: string,
};

type State = {
  now: WeeklyDayTime
}

export default class ConnectedSchedule<T> extends React.Component<Props<T>, State> {
  // memoized function since schedule building is complex
  buildSchedule = memoizeOne(buildSchedule);

  // id of interval that updates "now" state
  nowInterval: IntervalID;

  constructor() {
    super();
    this.state = {
      now: WeeklyDayTime.now()
    };
  }

  componentDidMount() {
    this.nowInterval = setInterval(() => {
      this.setState({ now: WeeklyDayTime.now() });
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.nowInterval);
  }

  render() {
    const { events, timeAccessor } = this.props;
    const { now } = this.state;
    const schedule = this.buildSchedule(events, timeAccessor);
    return <Schedule {...this.props} blocks={schedule} now={now} />;
  }
}

export type { timeAccessorType as timeAccessor };