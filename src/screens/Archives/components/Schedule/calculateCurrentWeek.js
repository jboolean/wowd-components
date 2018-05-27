// flow

import moment from 'moment';
import Alternations from 'util/Alternations';

const WEEK_1_REFERENCE = moment('2018-03-11');

export default function calculateCurrentWeek(now : moment = moment()) : Alternations.WEEK_1 | Alternations.WEEK_2 {
  if (now.diff(WEEK_1_REFERENCE, 'weeks') % 2 === 0) {
    return Alternations.WEEK_1;
  }
  return Alternations.WEEK_2;
}