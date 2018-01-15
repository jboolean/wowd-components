import * as React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import ArchivesApp from './ArchivesApp';
import GlobalPlayer from 'screens/GlobalPlayer';

const renderApp = (container, App) => {
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
};

export function renderArchives(container) {
  renderApp(container, ArchivesApp);
}

export function renderGlobalPlayer(container) {
  renderApp(container, GlobalPlayer);
}