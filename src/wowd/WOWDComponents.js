import * as React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import ShowsApp from './ShowsApp';
import DjsApp from './DjsApp';
import GlobalPlayer from './screens/GlobalPlayer';
import PlayButton from 'components/PlayButton';
import LiveTrack from 'LiveTrack';
import ShowSchedule from './screens/ShowSchedule';
import TrackManager from 'TrackManager';
import moment from 'moment';

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

const catalog = {};

/**
 * Render a custom play button for an arbitrary audio file.
 *
 * Caveat: it is assumed that the same file won't be rendered multiple times with different metadata.
 *
 * @param {Node} container node to render in
 * @param {Object} options
 * @param {string} options.url audio URL
 * @param {string} options.showName Name of show
 * @param {Date} options.onAirAt airing start time
 * @param {Object[]} options.djs list of Djs on the show
 *  A dj has a 'name' and optionally an 'id' and 'imageUrl'.
 * @param {string} options.theme button style.
 *  'dark', 'light', or 'primary'.
 * @param {string} options.size button size
 *  'small' or 'large'
 */
export function renderArchivePlayButton(container, options) {
  const metadata = {
    isArchive: true,
    showName: options.showName,
    djs: options.djs || [],
    onAirAt: moment(options.onAirAt)
  };

  if (!(options.url in catalog)) {
    catalog[options.url] = TrackManager.createTrack(options.url, metadata);
  }

  ReactDOM.render(
    <PlayButton track={catalog[options.url]} theme={options.theme} size={options.size} />,
    container);
}
