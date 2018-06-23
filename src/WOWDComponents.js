import * as React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import ArchivesApp from './ArchivesApp';
import GlobalPlayer from 'screens/GlobalPlayer';
import PlayButton from 'components/PlayButton';
import LiveTrack from 'LiveTrack';

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
  if (__DEV__ && module.hot) {
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

export function renderLiveTrackPlayButton(container) {
  ReactDOM.render(
    <PlayButton size="small" theme="light" track={LiveTrack} />,
    container);
}

export function activateLiveTrack() {
  LiveTrack.activate();
}

export function playLiveTrack() {
  LiveTrack.play();
}