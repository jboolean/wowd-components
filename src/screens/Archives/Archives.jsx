// @flow

import * as React from 'react';
import type { Show } from 'util/Types';
import fuzzy from 'fuzzy';

import ShowList from './components/ShowList';
import ShowSchedule from 'components/ShowSchedule';

import cx from 'classnames';

import stylesheet from './Archives.less';

// Separate searchable terms with 🐄 (cows), since this is unlikely to appear in the text
const getSearchHash = (show: Show) => {
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

export type displayMode = 'list' | 'schedule';

type Props = {
  shows: Show[],
  display: displayMode,
  onChangeDisplay: (displayMode) => void
};

type State = {
  filteredShows: Show[],
  filter: ?string,
  restoreViewAfterFilter: displayMode
};

export default class Archives extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      filteredShows: props.shows,
      filter: null,
      restoreViewAfterFilter: props.display
    };
    (this: any).handleFilterChange = this.handleFilterChange.bind(this);
    (this: any).handleDisplayChange = this.handleDisplayChange.bind(this);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.shows !== this.props.shows) {
      this.doFilter(nextProps.shows, this.state.filter);
    }
  }

  doFilter(shows: ?Show[], filter: ?string) {
    if (!filter) {
      this.setState({
        filteredShows: this.props.shows
      });
    }
    this.setState({
      filteredShows: filterShows(filter, this.props.shows)
    });
    if (this.props.display !== 'list') {
      this.props.onChangeDisplay('list');
    }
  }

  handleFilterChange(e: { target: { value: string } }) {
    const filter = e.target.value;
    this.setState({
      filter,
    });
    this.doFilter(this.props.shows, filter);
    if (!filter) {
      this.props.onChangeDisplay(this.state.restoreViewAfterFilter);
    }
  }

  handleDisplayChange(e: { target: {value: displayMode}}) {
    this.props.onChangeDisplay(e.target.value);
    this.setState({
      restoreViewAfterFilter: e.target.value
    });
  }

  renderList() {
    return <ShowList shows={this.state.filteredShows} />;
  }

  renderSchedule() {
    return (
      <ShowSchedule
        shows={this.state.filteredShows}
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
    const { display } = this.props;
    return (
      <div className={cx({ 'paddedPageContent': display !== 'schedule' })}>
        <div className={stylesheet.controls}>
          <input
            className={stylesheet.filter}
            name="filter"
            type="search"
            onChange={this.handleFilterChange}
            value={this.state.filter || ''}
            placeholder="Find shows"
          />
          <div className={stylesheet.displayModeRadioGroup}>
            <input
              type="radio"
              name="displayMode"
              value="list"
              id="displayModeList" checked={display === 'list'}
              onChange={this.handleDisplayChange}
            />
            <label htmlFor="displayModeList">Show List</label>

            <input type="radio"
              name="displayMode"
              value="schedule"
              id="displayModeSchedule"
              checked={display === 'schedule'}
              onChange={this.handleDisplayChange}
            />
            <label htmlFor="displayModeSchedule">Schedule</label>
          </div>
        </div>
        {this.renderShows()}
      </div>
    );
  }
}