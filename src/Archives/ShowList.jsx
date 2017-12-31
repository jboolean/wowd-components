// @flow

import * as React from 'react';

import stylesheet from './ShowList.less';

import type { Show as ShowType } from './util/Types';

type Props = {
  shows: ShowType[]
};


const ShowItem = (show : ShowType) => (
  <li key={show.id} className={stylesheet.show}>
    <div className={stylesheet.showName}>{show.name}</div>
    <div className={stylesheet.djs}>
      {show.djs.map(dj =>
        <span key={dj.id} className={stylesheet.dj}>{dj.name}</span>
      )}
    </div>
    <div className={stylesheet.showDescription}>{show.description}</div>
    <ol>
      {show.airings.map(airing =>
        <li key={airing.audioUrl}><a href={airing.audioUrl}>{airing.onAirAt.format()}</a></li>
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