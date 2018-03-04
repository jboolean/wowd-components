// @flow

import * as React from 'react';

import stylesheet from './ShowList.less';
import ShowEpisode from './ShowEpisode';
import moment from 'moment';

import { Link } from 'react-router-dom';

import type { Show as ShowType } from 'util/Types';

const MAX_EPISODES = 2;

type Props = {
  shows: ShowType[]
};

const formatAirTime = (airTime : {onAirAt: moment, offAirAt: moment}) : string =>
  (airTime.onAirAt.format('dddd[s], h:mma') + '–' + airTime.offAirAt.format('h:mma'))
    .replace(/:00/g, '');

const ShowItem = (show : ShowType) => (
  <li key={show.id} className={stylesheet.show}>
    <div className={stylesheet.showName}>
      <Link to={'/shows/' + show.id}>{show.name}</Link>
    </div>
    <div className={stylesheet.djs}>
      {show.djs.map(dj =>
        <span key={dj.id} className={stylesheet.dj}>{dj.name}</span>
      )}
    </div>
    <div className={stylesheet.showDescription}>{show.description}</div>
    <ol className={stylesheet.episodeList}>
      {show.episodes.slice(0, MAX_EPISODES).map(episode =>
        <li key={episode.audioUrl}><ShowEpisode episode={episode} /></li>
      )}
    </ol>
    <div className={stylesheet.airTimes}>
      {show.airTimes.map(formatAirTime).join(', ')}
    </div>
  </li>
);
export default function ShowList(props : Props) {
  return (
    <ol className={stylesheet.showList}>
      {props.shows.map(ShowItem)}
    </ol>
  );
}