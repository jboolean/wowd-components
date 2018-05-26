// @flow

const MAX_MILLIS = 86400000;
/**
 * Represents a time of date as on a wall clock.
 */
export default class LocalTime {
  static MAX : LocalTime;
  +millis:number;
  constructor(millis : number) {
    if (millis === null || millis === undefined) {
      throw new Error('Value is required');
    }
    if (millis > MAX_MILLIS) {
      throw new Error('Value overflows a standard day. ' + millis);
    }
    this.millis = millis;
  }

  static of(hour : number = 0, minute : number = 0, second : number = 0, millis : number = 0) : LocalTime {
    minute += hour * 60;
    second += minute * 60;
    millis += second * 1000;
    return new LocalTime(millis);
  }

  valueOf() {
    return this.millis;
  }

  equals(that : LocalTime) {
    return this.millis === that.millis;
  }

  compareTo(that : LocalTime) {
    if (this.millis < that.millis) {
      return -1;
    } else if (this.millis > that.millis) {
      return 1;
    }
    return 0;
  }

}

Object.defineProperty(LocalTime, 'MAX', { value: new LocalTime(MAX_MILLIS) });