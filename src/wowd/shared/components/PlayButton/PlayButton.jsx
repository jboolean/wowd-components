// @flow

import * as React from 'react';

import stylesheet from './PlayButton.less';

import PlayIcon from 'img/play.svg';
import StopIcon from 'img/stop.svg';
import PauseIcon from 'img/pause.svg';
import LoadingIcon from 'img/loading.svg';

import cx from 'classnames';

export type Theme = 'dark' | 'light' | 'primary';
export type Size = 'small' | 'large';

export type Props = {
  state: 'playing' | 'paused' | 'stopped' | 'loading' | 'prerollPlaying',
  onClick: () => void,
  theme: Theme,
  size: Size,
  className?: string,
  pauseable: boolean
};

export default function PlayButton(props: Props) {
  const state = props.state;
  const className = cx(
    stylesheet.playerButton,
    stylesheet[state],
    stylesheet[props.theme],
    stylesheet[props.size],
    props.className);
  let Icon;
  switch (state) {
  case 'prerollPlaying':
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