import * as React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import ShowsApp from './ShowsApp';
import DjsApp from './DjsApp';
import GlobalPlayer from './screens/GlobalPlayer';
import PlayButton from 'components/PlayButton';
import LiveTrack from 'LiveTrack';
import ShowSchedule from './screens/ShowSchedule';

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

export function renderShows(container) {
  renderApp(container, ShowsApp);
}

// Deprecated name
export function renderArchives(container) {
  renderShows(container);
}

export function renderGlobalPlayer(container) {
  renderApp(container, GlobalPlayer);
}

export function renderShowSchedule(container) {
  renderApp(container, ShowSchedule);
}

export function renderDjs(container) {
  renderApp(container, DjsApp);
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

export function toggleLiveTrack() {
  if (LiveTrack.state === 'playing') {
    LiveTrack.stop();
  } else {
    LiveTrack.play();
  }
}