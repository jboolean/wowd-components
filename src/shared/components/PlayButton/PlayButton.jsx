// @flow

import * as React from 'react';

import stylesheet from './PlayButton.less';

import PlayIcon from '-!babel-loader!svg-react-loader!img/play.svg';
import StopIcon from '-!babel-loader!svg-react-loader!img/stop.svg';
import PauseIcon from '-!babel-loader!svg-react-loader!img/pause.svg';
import LoadingIcon from '-!babel-loader!svg-react-loader!img/loading.svg';

import cx from 'classnames';

export type Theme = 'dark' | 'light' | 'primary';
export type Size = 'small' | 'large';

export type Props = {
  state : 'playing' | 'paused' | 'stopped' | 'loading',
  onClick : () => void,
  theme : Theme,
  size : Size,
  className? : string,
  pauseable: boolean
};

export default function PlayButton(props : Props) {
  const state = props.state;
  const className = cx(
    stylesheet.playerButton,
    stylesheet[state],
    stylesheet[props.theme],
    stylesheet[props.size],
    props.className);
  let Icon;
  switch (state) {
  case 'playing':
    Icon = props.pauseable ? PauseIcon : StopIcon;
    break;
  case 'loading':
    Icon = LoadingIcon;
    break;
  default:
    Icon = PlayIcon;
    break;
  }

  return (
    <button className={className} onClick={props.onClick}>
      <Icon className={cx(stylesheet.icon)}/>
    </button>
  );
}