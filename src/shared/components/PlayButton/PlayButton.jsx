// @flow

import * as React from 'react';

import stylesheet from './PlayButton.less';

import cx from 'classnames';

export type Theme = 'dark' | 'light';
export type Size = 'small' | 'large';

export type Props = {
  state : 'playing' | 'paused' | 'stopped' | 'loading',
  onClick : () => void,
  theme : Theme,
  size : Size,
  className : ?string
};

export default function PlayButton(props : Props) {
  const className = cx(
    stylesheet.playerButton,
    stylesheet[props.state],
    stylesheet[props.theme],
    stylesheet[props.size],
    props.className);

  return (
    <button className={className} onClick={props.onClick}>Play/Pause</button>
  );
}