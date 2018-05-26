// @flow

import type DayOfWeek from './DayOfWeek';
import type LocalTime from './LocalTime';

/**
 * A representation of a day of the week and a time of day.
 * Does not represent a calendar day.
 */
export default class WeeklyDayTime {
  weekday: DayOfWeek;
  time: LocalTime;
  constructor(weekday : DayOfWeek, time : LocalTime) {
    if (weekday === null || weekday === undefined) {
      throw new Error('weekday is required');
    }
    if (time === null || time === undefined) {
      throw new Error('time is required');
    }
    this.weekday = weekday;
    this.time = time;
  }

  static of(weekday : DayOfWeek, time : LocalTime) : WeeklyDayTime {
    return new WeeklyDayTime(weekday, time);
  }

  compareTo(that : WeeklyDayTime) {
    if (this.weekday !== that.weekday) {
      return this.weekday > that.weekday ? 1 : -1;
    }
    return this.time.compareTo(that.time);
  }

}