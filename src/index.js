import * as React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
// import 'normalize.css/normalize.css';
// import './site.css';

import App from './Archives';
// import './thirdparty/modernizr-custom';
import 'modernizr';

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app'),
  );
};

render(App);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept(() => {
    render(App);
  });
}