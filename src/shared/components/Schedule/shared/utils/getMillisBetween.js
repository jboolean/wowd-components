// @flow

import LocalTime from 'utils/time/LocalTime';
import WeeklyDayTime from 'utils/time/WeeklyDayTime';

const getMillisBetween = (start: WeeklyDayTime, end: WeeklyDayTime): number => {
  const startMillis = start.time.valueOf();
  let endDay = end.weekday;
  if (endDay < start.weekday) {
    // If it starts on Saturday and ends on Sunday.
    endDay += 7;
  }
  // Add full days if the end is on a future day (spans midnight)
  const endMillis = end.time.valueOf() + ((endDay - start.weekday) * LocalTime.MAX.millis);
  return endMillis - startMillis;
};


export default getMillisBetween;