//@flow

import * as React from 'react';

import type { Show } from 'util/Types';
import BlockData from 'components/Schedule/Block';
import { Link } from 'react-router-dom';
import ShowCard from '../ShowCard';
import Trigger from 'rc-trigger';
import Alternations from 'util/Alternations';

import formatLocalTime from 'util/time/formatLocalTime';
import calculateCurrentWeek from './calculateCurrentWeek';

import stylesheet from './ScheduleBlock.less';

const thisWeek = calculateCurrentWeek();

const ALTERNATIVES_ORDER = [
  Alternations.SPECIAL,
  Alternations.EVERY_WEEK,
  Alternations.WEEK_1,
  Alternations.WEEK];

const ALTERNATIVE_HEADING = {
  [Alternations.EVERY_WEEK]: 'Regularly Scheduled',
  [Alternations.WEEK_1]: thisWeek === '1' ? 'This Week' : 'Next Week',
  [Alternations.WEEK_]: thisWeek === '2' ? 'This Week' : 'Next Week',
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
            getPopupContainer={() => document.getElementById('siteWrapper')}
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
          </Trigger>
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
