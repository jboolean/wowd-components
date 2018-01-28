// @flow
import AudioPlayer from './AudioPlayer';
import Track from './Track';
import EventEmitter from 'eventemitter3';

/**
 * Handles the playing of multiple tracks using a single audio player.
 * Creating many audio players can hit concurrent load limts.
 * And no one wants to hear multiple tracks at once, right?
 *
 * Create dumb Track objects so the client has something to hold onto and hit play on,
 * without needing to directly load and unload things into the Audio player.
 *
 * Use the `player` property to access the underlying audio player.
 *
 * <M> : type of metadata object, if desired.
 */
export default class TrackManager<M> extends EventEmitter {
  player: AudioPlayer;
  activeTrack: ?Track<M>;
  constructor() {
    super();

    this.player = new AudioPlayer();
    this.activeTrack = null;

    this.player
      .on('playing', () => {
        if (this.activeTrack) {
          this.activeTrack.handlePositionChanged(this.player.getPosition());
        }
      })
      .on('durationchange', () => {
        if (this.activeTrack) {
          this.activeTrack.handleDurationChanged(this.player.getDuration());
        }
      })
      .on('ready', () => {
        if (this.activeTrack) {
          this.activeTrack.handleReady();
        }

      })
      .on('play', () => {
        if (this.activeTrack) {
          this.activeTrack.handlePlay();
        }

      })
      .on('pause', () => {
        if (this.activeTrack) {
          this.activeTrack.handlePaused();
        }

      })
      .on('stop', () => {
        if (this.activeTrack) {
          this.activeTrack.handleEnded();
        }
      })
      .on('ended', () => {
        if (this.activeTrack) {
          this.activeTrack.handleEnded();
        }
      });
  }

  /**
   * Factory method to create a Track object.
   * A Track object is a representation of a single piece of audio.
   * @param  {String} url - url to load
   * @return {Track}
   */
  createTrack(url : string, metadata : M) : Track<M> {

    const track = new Track(url, metadata);

    track.setCallbacks({
      handlePlay: () => {
        this.activate(track);
        this.player.playFrom(track.position);
      },
      handlePause: () => {
        if (track.isActive) {
          this.player.pause();
        }
      },
      handleSeek: (position) => {
        if (track.isActive) {
          this.player.seek(position);
        }
        track.handlePositionChanged(position);
      },
      handleActivate: () => {
        this.activate(track);
      },
      handleStop: () => {
        if (track.isActive) {
          this.player.stop();
        }
      }
    });

    return track;
  }

  /**
   * Make track active, and the current track inactive.
   * @param {Track} track
   */
  activate(track : Track<M>) {
    if (this.activeTrack === track) {
      return;
    }

    const outgoingTrack = this.activeTrack;
    if (outgoingTrack) {
      outgoingTrack.pause();
      // track is paused asynchonously, so new src is set before pause event is fired.
      outgoingTrack.handlePaused();
      outgoingTrack.handleActiveChange(false);
    }

    this.activeTrack = track;

    this.emit('trackChanged', this.activeTrack);

    if (track) {
      this.player.setSrc(track.url);
      track.handleActiveChange(true);
    }

  }
}