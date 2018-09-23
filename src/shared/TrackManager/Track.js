// @flow
import EventEmitter from 'eventemitter3';

const noop = () => {};

type Callbacks = {
  handlePlay: () => void,
  handleActivate: () => void,
  handlePause: () => void,
  handleStop: () => void,
  handleSeek: (position: number) => void
};

const defaultCallbacks : Callbacks = {
  handlePlay: noop,
  handleActivate: noop,
  handlePause: noop,
  handleSeek: noop,
  handleStop: noop
};

type State = 'playing' | 'paused' | 'stopped' | 'loading' | 'prerollPlaying' ;

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
export default class Track<M> extends EventEmitter {
  metadata: M;
  callbacks: Callbacks;
  state: State;
  position: number;
  duration: number;
  url: string;
  isActive: boolean;
  preroll: ?Track<M>;
  _prerollEndedListener: () => void;

  // Create using TrackManager, please.
  constructor(url: string, metadata: M, preroll?: ?Track<M>) {
    super();

    this.url = url;
    this.metadata = metadata;
    this.position = 0;
    this.duration = 0;
    this.isActive = false;
    this.state = 'stopped';
    this.callbacks = Object.assign({}, defaultCallbacks);
    this.preroll = preroll;
  }

  /**
   * Set functions that are called to implement Track's command methods.
   * To be set by TrackManager.
   * @param {Object} callbacks
   * @param {Function} callbacks.handlePlay - the track wants to play
   * @param {Function} callbacks.handlePause - the track wants to pause
   * @param {Function} callbacks.handleSeek - the track wants to move the playhead
   */
  setCallbacks(callbacks: Callbacks) {
    this.callbacks = Object.assign({}, defaultCallbacks, callbacks);
  }

  setMetadata(metadata: M) {
    this.metadata = metadata;
    this.emit('metadataChanged', this.metadata, this);
  }

  /**
   * Play this track.
   */
  play() {
    if (this.state === 'prerollPlaying' && this.preroll) {
      this.preroll.play();
    } else if (this.preroll && this.state === 'stopped') {
      const preroll = this.preroll;
      this.state = 'prerollPlaying';
      preroll.on('play', () => {this.emit('prerollPlay', this);});
      this._prerollEndedListener = () => {this.callbacks.handlePlay();};
      preroll.on('ended', this._prerollEndedListener);
      if (this.preroll) {this.preroll.play();}
    } else {
      this.callbacks.handlePlay();
    }
  }

  /**
   * Activate this track.
   */
  activate() {
    this.callbacks.handleActivate();
  }

  /**
   * Pause this track.
   */
  pause() {
    if (this.preroll && this.preroll.state !== 'stopped') {
      this.preroll.pause();
    }
    this.callbacks.handlePause();
  }

  /**
   * Jump the playhead to the specified time
   * @param  {Number} position - time in seconds
   */
  seek(position: number) {
    this.callbacks.handleSeek(position);
  }

  stop() {
    if (this.preroll && this.preroll.state !== 'stopped') {
      const preroll = this.preroll;
      preroll.removeListener('ended', this._prerollEndedListener);
      preroll.stop();
      this.handleEnded();
    }
    this.callbacks.handleStop();
  }

  // Methods to be called by TrackManager to update our state

  /**
   * The position of this track has changed
   * @param  {Number} newPosition - the current position
   */
  handlePositionChanged(newPosition: number) {
    this.position = newPosition;
    this.emit('positionChanged', newPosition, this);
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

  handleLoad() {
    this.state = 'loading';
    this.emit('load');
  }

  /**
   * Notify this track that its duration has changed.
   */
  handleDurationChanged(newDuration: number) {
    this.duration = newDuration;
    this.emit('durationChanged', newDuration, this);
  }

  /**
   * Notify this track that it can play
   */
  handleReady() {
    this.state = 'stopped';
    this.emit('ready', this);
  }

  /**
   * Notify this track that it has become active/inactive in the manager
   * @param  {Boolean} isNowActive
   */
  handleActiveChange(isNowActive: boolean) {
    this.isActive = isNowActive;
    this.emit(isNowActive ? 'active' : 'inactive', this);
  }
}