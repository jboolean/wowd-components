//@flow

import * as React from 'react';

import type { Show } from 'util/Types';
import BlockData from 'components/Schedule/Block';
import { Link } from 'react-router-dom';
import ShowCard from '../ShowCard';
import Trigger from 'rc-trigger';

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

export default class ScheduleBlock extends React.Component<{block:BlockData<Show>}, {}> {
  renderAltenativeHeader(alternativeId : string) {
    const hasMultipleAlternatives = Object.keys(this.props.block.alternatives).length > 1;
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
