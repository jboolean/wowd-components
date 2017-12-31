import React, { Component } from 'react';
import { render } from 'react-dom';

import styles from './test.less';

export default class Hello extends Component {
  render() {
    return (
      <div className={ styles.testContainer }>
        {JSON.stringify(styles)}
      </div>
    );
  }
}

render(<Hello />, document.getElementById('app'));