// @flow
import { getAllShows } from 'util/ShowArchivesApi';
import collateByShow from 'util/collateByShow';
import type { Show } from 'util/Types';


let promise;


// Fetch, transform, and cache archive summary
export default function getArchiveSummaries() : Promise<Show[]> {
  if (!promise) {
    promise = getAllShows()
      .then(resp => collateByShow(resp.data));
  }
  return promise;
}