// @flow
import * as React from 'react';

import ScheduleBlock from './components/ScheduleBlock';
import { dayClassName, dayNamesClassName, activeDayNameClassName } from './components/ScheduleBlock';
import Schedule from 'components/Schedule';
import type { timeAccessor } from 'components/Schedule';
import type { Show } from 'util/Types';

import WeeklyDayTime from 'util/time/WeeklyDayTime';
import LocalTime from 'util/time/LocalTime';
import DayOfWeek from 'util/time/DayOfWeek';
import moment from 'moment';

const convertMomentToWeeklyDayTime = (m: moment): WeeklyDayTime => {
  const dayOfWeek = m.day() + DayOfWeek.SUNDAY;
  const time = LocalTime.of(m.get('hours'), m.get('minutes'), m.get('seconds'), m.get('milliseconds'));
  return WeeklyDayTime.of(dayOfWeek, time);
};

const showOccurranceAccessor : timeAccessor<Show> = (show) => {
  return show.airTimes.map(({ onAirAt, offAirAt }) => {
    return {
      start: convertMomentToWeeklyDayTime(onAirAt),
      end: convertMomentToWeeklyDayTime(offAirAt),
      alternationId: show.alternationId
    };
  });
};

type Props = {
  shows: Show[],
};

export default function ShowSchedule(props: Props) {
  return (
    <Schedule
      events={props.shows}
      timeAccessor={showOccurranceAccessor}
      height={3500}
      dayStartsAt={LocalTime.of(6)}
      renderBlock={ScheduleBlock}
      dayClassName={dayClassName}
      dayNamesClassName={dayNamesClassName}
      activeDayNameClassName={activeDayNameClassName}
    />
  );
}