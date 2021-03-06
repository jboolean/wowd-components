// @flow

import * as React from 'react';

import stylesheet from './ShowList.less';
import ShowCard from 'components/ShowCard';

import type { Show as ShowType } from 'utils/Types';

type Props = {
  shows: ShowType[]
};

export default function ShowList(props: Props) {
  return (
    <ol className={stylesheet.showList}>
      {props.shows.map((show) => <li key={show.id} ><ShowCard {...show}/></li>)}
    </ol>
  );
}