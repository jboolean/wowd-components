// @flow

import * as React from 'react';
import type { Show } from 'util/Types';
import fuzzy from 'fuzzy';

import ShowList from './components/ShowList';
import ScheduleBlock from './components/Schedule/ScheduleBlock';
import { dayClassName } from './components/Schedule/ScheduleBlock';
import Schedule from 'components/Schedule';
import type { timeAccessor } from 'components/Schedule';
import WeeklyDayTime from 'util/time/WeeklyDayTime';
import LocalTime from 'util/time/LocalTime';
import DayOfWeek from 'util/time/DayOfWeek';
import moment from 'moment';

import stylesheet from './Archives.less';

// Separate searchable terms with 🐄 (cows), since this is unlikely to appear in the text
const getSearchHash = (show : Show) => {
  const djNames = show.djs
    .map(dj => dj.name);
  return [show.name].concat(djNames).join('\u{1F404}');
};

const filterShows = (filter, shows) => {
  if (filter && filter.length && Array.isArray(shows)) {
    return fuzzy.filter(filter, shows, {
      extract: getSearchHash
    }).map((result) => result.original);
  }

  return shows;
};

const convertMomentToWeeklyDayTime = (m : moment) : WeeklyDayTime => {
  const dayOfWeek = m.day() + DayOfWeek.SUNDAY;
  const time = LocalTime.of(m.get('hours'), m.get('minutes'), m.get('seconds'), m.get('milliseconds'));
  return WeeklyDayTime.of(dayOfWeek, time);
};

const showOccurranceAccessor : timeAccessor<Show> = (show) => {
  return show.airTimes.map(({ onAirAt, offAirAt }) => {
    return {
      start: convertMomentToWeeklyDayTime(onAirAt),
      end: convertMomentToWeeklyDayTime(offAirAt),
      alternationId: '' + show.alternationId
    };
  });
};

type Props = {
  shows: Show[],
  display: 'list' | 'schedule'
};

type State = {
  filteredShows : Show[],
  filter: ?string
};

export default class Archives extends React.Component<Props, State> {
  constructor(props : Props) {
    super(props);
    this.state = {
      filteredShows: props.shows,
      filter: null
    };
    (this:any).onFilterChange = this.onFilterChange.bind(this);
  }

  componentWillReceiveProps(nextProps : Props) {
    this.doFilter(nextProps.shows, this.state.filter);
  }

  doFilter(shows : ?Show[], filter : ?string) {
    if (!filter) {
      this.setState({
        filteredShows: this.props.shows
      });
    }
    this.setState({
      filteredShows: filterShows(filter, this.props.shows)
    });
  }

  onFilterChange(e : { target : { value : string } }) {
    const filter = e.target.value;
    this.setState({
      filter,
    });
    this.doFilter(this.props.shows, filter);
  }

  renderList() {
    return <ShowList shows={this.state.filteredShows} />;
  }

  renderSchedule() {
    return (
      <Schedule
        events={this.state.filteredShows}
        timeAccessor={showOccurranceAccessor}
        height={3000}
        dayStartsAt={LocalTime.of(6)}
        renderBlock={ScheduleBlock}
        dayClassName={dayClassName}
      />
    );
  }

  renderShows() {
    switch (this.props.display) {
    case 'list':
      return this.renderList();
    case 'schedule':
      return this.renderSchedule();
    }
  }

  render() {
    return (
      <div>
        <div className={stylesheet.controls}>
          <input
            className={stylesheet.filter}
            name="filter"
            type="search"
            onChange={this.onFilterChange}
            value={this.state.filter || ''}
            placeholder="Find shows"
          />
        </div>
        {this.renderShows()}
      </div>
    );
  }
}