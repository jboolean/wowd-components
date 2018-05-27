// @flow
import WeeklyDayTime from 'util/time/WeeklyDayTime';

// Alternatives are groups of events keyed by a string,
// e.g. 'even' for events that occur on even weeks.
// The alternative key separates events that occur at the same time on different weeks.
export type Event<T> = {
  start: WeeklyDayTime,
  end: WeeklyDayTime,
  data: T
};

export type Alternatives<T> = { [string]: Event<T>[] };

export default class Block<T> {
  +start: WeeklyDayTime;
  +end: WeeklyDayTime;
  +alternatives: Alternatives<T>;

  constructor(start: WeeklyDayTime, end: WeeklyDayTime, alternatives: Alternatives<T>) {
    this.start = start;
    this.end = end;
    this.alternatives = alternatives;
  }

  overlaps(that: Block<*>) {
    return (this.start.compareTo(that.start) >= 0 && this.start.compareTo(that.end) < 0) ||
      (this.end.compareTo(that.start) > 0 && this.end.compareTo(that.end) <= 0);
  }

  /**
   * Creates a new block that incorporates another block.
   * The time range is extended to cover both block, and event lists are merged.
   */
  merge(that: Block<T>): Block<T> {
    const start = this.start.compareTo(that.start) < 0 ? this.start : that.start;
    const end = this.end.compareTo(that.end) > 0 ? this.end : that.end;

    const newAlts = Object.assign({}, this.alternatives);
    Object.keys(that.alternatives)
      .forEach((altId) => {
        if (altId in newAlts) {
          newAlts[altId] = newAlts[altId].concat(that.alternatives[altId]);
        } else {
          newAlts[altId] = that.alternatives[altId].slice();
        }
      });

    return new Block(start, end, newAlts);
  }
}