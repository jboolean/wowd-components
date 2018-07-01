// @flow

import * as React from 'react';
import type { Show } from 'utils/Types';
import fuzzy from 'fuzzy';

import ShowList from './components/ShowList';

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
  shows: Show[]
};

type State = {
  filteredShows: Show[],
  filter: ?string,
};

export default class Archives extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      filteredShows: props.shows,
      filter: null,
    };
    (this: any).handleFilterChange = this.handleFilterChange.bind(this);
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
  }

  handleFilterChange(e: { target: { value: string } }) {
    const filter = e.target.value;
    this.setState({
      filter,
    });
    this.doFilter(this.props.shows, filter);
  }

  render() {
    return (
      <div>
        <div className={stylesheet.controls}>
          <input
            className={stylesheet.filter}
            name="filter"
            type="search"
            onChange={this.handleFilterChange}
            value={this.state.filter || ''}
            placeholder="Find shows"
          />
        </div>
        <ShowList shows={this.state.filteredShows} />
      </div>
    );
  }
}