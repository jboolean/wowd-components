// @flow

import * as React from 'react';
import { getAllShows } from './ShowArchivesApi';
import collateByShow from './util/collateByShow';
import type { Show } from './util/Types';
import fuzzy from 'fuzzy';

import ShowList from './ShowList';

const filterByShowName = (filter, shows) => {
  if (filter && filter.length && Array.isArray(shows)) {
    return fuzzy.filter(filter, shows, {
      extract: (show) => show.name
    }).map((result) => result.original);
  }

  return shows;
};

type State = {
  shows: ?Show[],
  filteredShows : ?Show[],
  filter: ?string
};

export default class ArchivesApp extends React.Component<void, State> {
  constructor(props : void) {
    super(props);
    this.state = {
      shows: null,
      filteredShows: null,
      filter: null
    };
    (this:any).onFilterChange = this.onFilterChange.bind(this);
  }

  componentDidMount() {
    getAllShows()
      .then(resp => collateByShow(resp.data))
      .then(shows => {
        this.setState({ shows });
      })
      .catch(err => console.error(err));
  }

  onFilterChange(e : { target : { value : string } }) {
    const filter = e.target.value;
    if (!filter) {
      this.setState({
        filter: null,
        filteredShows: null
      });
    }
    this.setState({
      filter,
      filteredShows: filterByShowName(filter, this.state.shows)
    });
  }

  render() {
    if (!this.state.shows) {
      return null;
    }

    return (
      <div>
        <label htmlFor="filter">Find by title</label>
        <input name="filter" type="search" onChange={this.onFilterChange} value={this.state.filter || ''}/>
        <ShowList shows={this.state.filteredShows || this.state.shows} />
      </div>
    );
  }
}