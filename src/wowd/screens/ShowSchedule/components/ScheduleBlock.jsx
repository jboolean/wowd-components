//@flow

import * as React from 'react';

import type { Show } from 'utils/Types';
import BlockData from 'components/Schedule/Block';
import Link from 'components/AppLink';
import ShowCard from 'components/ShowCard';
import Trigger from 'rc-trigger';
import Alternations from 'utils/Alternations';

import formatLocalTime from 'utils/time/formatLocalTime';
import calculateCurrentWeek from '../utils/calculateCurrentWeek';
import UAParser from 'ua-parser-js';

import stylesheet from './ScheduleBlock.less';

const thisWeek = calculateCurrentWeek();
const ua = new UAParser();
const device = ua.getDevice();
// Okay, so… iOS is dumb and fires fake mouseover events on links,
// and if the DOM changes, then it suppresses a click.
// Need to disable hover for these devices without disabling for all
// mobile/touch/small devices.
const suppressHover = device.vendor === 'Apple' &&
  (device.type === 'mobile' || device.type === 'tablet');

const ALTERNATIVES_ORDER : $Values<Alternations>[] = [
  Alternations.SPECIAL,
  Alternations.EVERY_WEEK];
if (thisWeek === Alternations.WEEK_1) {
  ALTERNATIVES_ORDER.push(Alternations.WEEK_1, Alternations.WEEK_2);
} else {
  ALTERNATIVES_ORDER.push(Alternations.WEEK_2, Alternations.WEEK_1);
}

const ALTERNATIVE_HEADING : {[$Values<Alternations>]: string} = {
  [Alternations.EVERY_WEEK]: 'Regularly Scheduled',
  [Alternations.WEEK_1]: thisWeek === Alternations.WEEK_1 ? 'This Week' : 'Next Week',
  [Alternations.WEEK_2]: thisWeek === Alternations.WEEK_2 ? 'This Week' : 'Next Week',
  [Alternations.SPECIAL]: 'Special Show'
};

export default class ScheduleBlock extends React.Component<{block: BlockData<Show>}, {}> {
  renderAltenativeHeader(alternativeId: $Values<Alternations>) {
    const hasMultipleAlternatives = Object.keys(this.props.block.alternatives).length > 1;
    if (!hasMultipleAlternatives) {
      return null;
    }
    return <span className={stylesheet.alternativeHeading}>{ALTERNATIVE_HEADING[alternativeId]}</span>;
  }

  renderShows(block: BlockData<Show>, alternativeId: $Values<Alternations>) {
    const events = block.alternatives[alternativeId];
    return events.map((event) =>
      (<div key={event.data.id}>
        {events.length > 1 ?
          <div className={stylesheet.timeHeading}>
            {formatLocalTime(event.start.time)}
          </div> : null}
        <div className={stylesheet.show}>
          {suppressHover ? <Link to={'/shows/' + event.data.id}>{event.data.name}</Link> :
            <Trigger
              action={['hover']}
              popup={(
                <div className={stylesheet.popupContainer}>
                  <ShowCard {...event.data} />
                </div>
              )}
              popupAlign={{
                points: ['bc', 'tc'],
                offset: [0, -15],
                overflow: {
                  adjustX: true,
                  adjustY: true
                }
              }}
              getPopupContainer={() =>
                document.getElementById('siteWrapper') ||
                document.querySelector('.Site') ||
                document.body}
              popupTransitionName={{
                enter: stylesheet.slideUpEnter,
                enterActive: stylesheet.slideUpEnterActive,
                appear: stylesheet.slideUpAppear,
                appearActive: stylesheet.slideUpAppearActive,
                leave: stylesheet.slideUpLeave,
                leaveActive: stylesheet.slideUpLeaveActive
              }}
            >
              <Link to={'/shows/' + event.data.id}>{event.data.name}</Link>
            </Trigger>}
          <div className={stylesheet.djs}>
            {event.data.djs.map(dj =>
              <Link key={dj.id} className={stylesheet.dj} to={`/djs/${dj.id}`}>{dj.name}</Link>
            )}
          </div>
        </div>
      </div>));
  }

  render() {
    const block = this.props.block;

    return (
      <div className={stylesheet.block}>
        {ALTERNATIVES_ORDER
          .filter(alternativeId => alternativeId in block.alternatives)
          .map(alternativeId =>
            (<div key={alternativeId} className={stylesheet.alternation}>
              {this.renderAltenativeHeader(alternativeId)}
              {this.renderShows(block, alternativeId)}
            </div>)
          )}
      </div>
    );
  }
}

export const dayClassName = stylesheet.day;
export const dayNamesClassName = stylesheet.dayNames;
export const activeDayNameClassName = stylesheet.active;
