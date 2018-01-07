import * as React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './ArchivesApp';

export function renderArchives(container) {
  const render = Component => {
    ReactDOM.render(
      <AppContainer>
        <Component />
      </AppContainer>,
      container,
    );
  };

  render(App);

  // Webpack Hot Module Replacement API
  if (module.hot) {
    module.hot.accept(() => {
      render(App);
    });
  }
}