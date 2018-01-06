// @flow

import * as React from 'react';
import type { Show } from './util/Types';
import fuzzy from 'fuzzy';

import ShowList from './ShowList';

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

type Props = {
  shows: Show[]
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

  render() {
    return (
      <div>
        <label htmlFor="filter">Find by title</label>
        <input name="filter" type="search" onChange={this.onFilterChange} value={this.state.filter || ''}/>
        <ShowList shows={this.state.filteredShows} />
      </div>
    );
  }
}