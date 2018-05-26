//@flow

import * as React from 'react';

import type { Show } from 'util/Types';
import BlockData from 'components/Schedule/Block';

import formatLocalTime from 'util/time/formatLocalTime';

import stylesheet from './ScheduleBlock.less';

const thisWeek = 1;

const ALTERNATIVES = ['special', '0', '1', '2'];

const ALTERNATIVE_HEADING = {
  '0': 'Regularly Scheduled',
  '1': thisWeek === 1 ? 'This Week' : 'Next Week',
  '2': thisWeek === 2 ? 'This Week' : 'Next Week',
  'special': 'Special Show'
};

export default class ScheduleBlock extends React.Component<BlockData<Show>, {}> {
  renderAltenativeHeader(alternativeId : string) {
    const hasMultipleAlternatives = Object.keys(this.props.alternatives).length > 1;
    if (!hasMultipleAlternatives) {
      return null;
    }
    return <span className={stylesheet.alternativeHeading}>{ALTERNATIVE_HEADING[alternativeId]}</span>;
  }

  renderShows(block : BlockData<Show>, alternativeId : string) {
    const events = block.alternatives[alternativeId];
    return events.map((event) =>
      (<div key={event.data.id}>
        {events.length > 1 ?
          <div className={stylesheet.timeHeading}>
            {formatLocalTime(event.start.time)}
          </div> : null}
        <div className={stylesheet.show}>
          {event.data.name}
        </div>
      </div>));
  }

  render() {
    const block = this.props;

    return (
      <div className={stylesheet.block}>
        {ALTERNATIVES
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
