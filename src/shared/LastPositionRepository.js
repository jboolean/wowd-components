// @flow

import TrackManager from './TrackManager';
import Track from './TrackManager/Track';
import throttle from 'lodash/throttle';

// $FlowFixMe
import Modernizr from 'modernizr';

declare var __DEV__: boolean;

const PREFIX = 'org.takomaradio.furthestPosition.';

const boundTracks : WeakSet<Track<any>> = new WeakSet();

if (Modernizr.localstorage) {
  TrackManager.on('trackChanged', (track) => {
    if (boundTracks.has(track)) {
      return;
    }
    track.on('positionChanged', throttle((position: number) => {
      const key = PREFIX + track.url;
      const last = window.localStorage.getItem(key) || 0;
      if (position <= last) {
        return;
      }
      window.localStorage.setItem(key, position);
    }, 5000));
    boundTracks.add(track);
  });
} else if (__DEV__) {
  console.warn('Local storage not supported. Will not save playback position.');
}

/**
 * Get furthest playback position for a track.
 */
export function getFurthestPosition(track: Track<any>): number | null {
  if (!Modernizr.localstorage) {
    if (__DEV__) {
      console.warn('Local storage not supported. Cannot get playback position.');
    }
    return null;
  }
  const key = PREFIX + track.url;
  const strValue = window.localStorage.getItem(key);
  if (strValue !== null) {
    return parseFloat(strValue);
  }
  return null;
}