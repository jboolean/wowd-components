//@flow
import type LocalTime from 'util/time/LocalTime';

const HOUR_MS = 1000 * 60 * 60;

export default function formatLocalTime(time: LocalTime, trimMinutes: boolean = false): string {
  const hour = Math.floor(time.millis / HOUR_MS);
  const minute = Math.floor((time.millis - (hour * HOUR_MS)) / (1000 * 60));
  const am = hour < 12;
  let out = '';
  if ((hour % 12) === 0) {
    out += 12;
  } else {
    out += hour % 12;
  }
  if (!trimMinutes || minute > 0) {
    out += ':';
    if (minute < 10) {
      out += '0';
    }
    out += minute;
  }
  out += am ? 'am' : 'pm';
  return out;
}