import EventEmitter from 'eventemitter3';
import needsTimeRounding from './needsTimeRounding';


// Expose a subset of the HTML events.
// With a shorter list and nicer names.
// HTML has a lengthly list of often similar, sometimes misleading event names.
// This facade is a curated and controlled version of that.
// html name => our name
const eventMap = {
  timeupdate: 'playing',
  loadstart: 'load',
  durationchange: 'durationchange',
  canplay: 'ready',
  pause: 'pause',
  playing: 'play',
  ended: 'ended'
};
// also, 'stop' is a custom event for when it is stopped.

const defaultConfig = {
  url: null,
  volume: 1
};

export default class AudioPlayer extends EventEmitter {

  /**
   * A facade to an audio player.
   * Performs basic audio playing functions.
   * @param {Object} [config]
   * @param {String} [config.url] - url of audio file to load
   * @param {Number} [config.volume=1] - number between 0 and 1
   */
  constructor(config = {}) {
    super();

    config = Object.assign({}, defaultConfig, config);

    this.audioEl = document.createElement('audio');
    if (config.url) {
      this.audioEl.src = this.url = config.url;
    }
    this.audioEl.volume = config.volume;
    this._needsLoad = true;

    this.audioEvents = [];

    Object.keys(eventMap).forEach(htmlEventName => {

      const eventFn = () => this.emit(eventMap[htmlEventName]);

      this.audioEvents.push({
        name: htmlEventName,
        fn: eventFn
      });

      this.audioEl.addEventListener(htmlEventName, eventFn);
    });
  }

  /**
   * Detach all event listeners.
   */
  destroy() {
    this.audioEvents.forEach(evt => {
      this.audioEl.removeEventListener(evt.name, evt.fn);
    });
  }

  /**
   * Set the volume
   * @param {Number} newVal - between 0 and 1
   */
  setVolume(newVal) {
    this.audioEl.volume = newVal;
  }

  /**
   * Get the volume setting
   * @return {Number}
   */
  getVolume() {
    return this.audioEl.volume;
  }

  /**
   * Change the url of this player.
   * @param {String} newVal - new url
   */
  setSrc(newVal) {
    this.audioEl.src = this.url = newVal;
    this._needsLoad = true;
  }

  /**
   * Load if needed, then play this player
   */
  play() {
    this.playFrom();
  }

  stop() {
    // There isn't really a stop function.
    this.audioEl.src = 'about:blank';
    this._needsLoad = true;
    this.emit('stop');
  }

  /**
   * Load if needed, then seek, then play
   */
  playFrom(position = null) {
    if (!this.url) {
      throw new Error('Cannot play: Need to set a url first.');
    }

    if (!this.audioEl.src || this.audioEl.src === 'about:blank') {
      this.audioEl.src = this.url;
    }

    if (this._needsLoad) {
      this.once('ready', () => {
        if (position !== null) {
          this.audioEl.currentTime = position; // Firefox doesn't like to seek until its loaded.
        }
        this.audioEl.play(); // Chrome doesn't always play() until you load().
      });

      this.audioEl.load();
      this.audioEl.play(); // Firefox doesn't always load until you play().

      this._needsLoad = false;
    } else if (this.audioEl.readyState >= 3) {
      if (position !== null) {
        this.audioEl.currentTime = position;
      }
      this.audioEl.play();
    }
    // if here, it's not loaded, but loading again will do no good.
    // Maybe still loading or failed load.
  }

  /**
   * Pause this player
   */
  pause() {
    this.audioEl.pause();
  }

  /**
   * Jump the playhead to a specific time
   * Caution: do not seek before 'ready/canplay'. FF does not take well to this.
   * @param  {Number} time - time from start in seconds
   */
  seek(time) {
    if (this.audioEl.readyState === 0) {
      return;
    }

    if (!this.audioEl.paused && needsTimeRounding) {
      time = Math.floor(time);
    }

    const oldTime = this.audioEl.currentTime;
    this.audioEl.currentTime = time;
    this.emit('seek', oldTime, time);
  }

  /**
   * Get the current playhead position
   * @return {Number} seconds from start
   */
  getPosition() {
    return this.audioEl.currentTime;
  }

  /**
   * Get duration of file. File must be loaded first.
   * Consider waiting for durationchange, load, or ready.
   * @return {Number} duration in seconds or NaN if not loaded
   */
  getDuration() {
    return this.audioEl.duration;
  }
}
