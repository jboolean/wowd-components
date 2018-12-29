// @flow
import * as React from 'react';

// import must come early to give default styles low precedence
import Schedule from 'components/Schedule';

import ScheduleBlock from './components/ScheduleBlock';
import {
  dayClassName,
  dayNamesClassName,
  activeDayNameClassName,
  nowBarLineClassName,
  nowBarDotClassName
} from './components/ScheduleBlock';
import type { timeAccessor } from 'components/Schedule';
import type { Show } from 'utils/Types';

import WeeklyDayTime from 'utils/time/WeeklyDayTime';
import LocalTime from 'utils/time/LocalTime';
import DayOfWeek from 'utils/time/DayOfWeek';
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
      nowBarLineClassName={nowBarLineClassName}
      nowBarDotClassName={nowBarDotClassName}
    />
  );
}