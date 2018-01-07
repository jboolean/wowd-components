// @flow

import * as React from 'react';

import stylesheet from './ShowList.less';
import ShowAiring from './ShowAiring';

import { Link } from 'react-router-dom';

import type { Show as ShowType } from 'util/Types';

type Props = {
  shows: ShowType[]
};

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
    <ol className={stylesheet.airingList}>
      {show.airings.map(airing =>
        <li key={airing.audioUrl}><ShowAiring airing={airing} /></li>
      )}
    </ol>
  </li>
);
export default function ShowList(props : Props) {
  return (
    <ol className={stylesheet.showList}>
      {props.shows.map(ShowItem)}
    </ol>
  );
}