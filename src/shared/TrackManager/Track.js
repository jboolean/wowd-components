import EventEmitter from 'eventemitter3';

const noop = () => {};

const defaultCallbacks = {
  handlePlay: noop,
  handlePause: noop,
  handleSeek: noop
};

/**
 * An abstraction for a managed piece of audio.
 *
 * Constructed ONLY by TrackManager, which manages which track is active.
 * This allows one player to be used for multiple tracks.
 *
 * Events:
 * * play - started playing
 * * pause - paused
 * * ended - that's the end of the reel
 * * positionChange - playhead moved (is playing)
 * * durationChange - the duration property changed, likely because the file just loaded.
 * * ready - ready to play
 * * active - became the active track in the TrackManager
 * * inactive - no longer active in the manager
 *
 * State (read only)
 * * url
 * * position
 * * duration
 * * isActive
 */
export default class Track extends EventEmitter {
  // Create using TrackManager, please.
  constructor(url) {
    super();

    this.url = url;
    this.position = 0;
    this.duration = 0;
    this.isActive = false;
    this.state = 'stopped';
    this.callbacks = Object.assign({}, defaultCallbacks);
  }

  /**
   * Set functions that are called to implement Track's command methods.
   * To be set by TrackManager.
   * @param {Object} callbacks
   * @param {Function} callbacks.handlePlay - the track wants to play
   * @param {Function} callbacks.handlePause - the track wants to pause
   * @param {Function} callbacks.handleSeek - the track wants to move the playhead
   */
  setCallbacks(callbacks) {
    this.callbacks = Object.assign({}, defaultCallbacks, callbacks);
  }

  /**
   * Play this track.
   */
  play() {
    this.callbacks.handlePlay();
  }

  /**
   * Pause this track.
   */
  pause() {
    this.callbacks.handlePause();
  }

  /**
   * Jump the playhead to the specified time
   * @param  {Number} position - time in seconds
   */
  seek(position) {
    this.callbacks.handleSeek(position);
  }

  // Methods to be called by TrackManager to update our state

  /**
   * The position of this track has changed
   * @param  {Number} newPosition - the current position
   */
  handlePositionChanged(newPosition) {
    this.position = newPosition;
    this.emit('positionChange', this);
  }

  /**
   * Notifiy this track that it is now playing
   */
  handlePlay() {
    this.state = 'playing';
    this.emit('play', this);
  }

  /**
   * Notify this track that it is now paused
   */
  handlePaused() {
    this.state = 'paused';
    this.emit('pause', this);
  }

  /**
   * Notify this track that it has ended
   */
  handleEnded() {
    this.state = 'stopped';
    this.emit('ended', this);
  }

  /**
   * Notify this track that its duration has changed.
   */
  handleDurationChanged(newDuration) {
    this.duration = newDuration;
    this.emit('durationChange', this);
  }

  /**
   * Notify this track that it can play
   */
  handleReady() {
    this.emit('ready', this);
  }

  /**
   * Notify this track that it has become active/inactive in the manager
   * @param  {Boolean} isNowActive
   */
  handleActiveChange(isNowActive) {
    this.isActive = isNowActive;
    this.emit(isNowActive ? 'active' : 'inactive', this);
  }
}