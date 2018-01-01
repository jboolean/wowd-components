import AudioPlayer from './AudioPlayer';
import Track from './Track';

/**
 * Handles the playing of multiple tracks using a single audio player.
 * Creating many audio players can hit concurrent load limts.
 * And no one wants to hear multiple tracks at once, right?
 *
 * Create dumb Track objects so the client has something to hold onto and hit play on,
 * without needing to directly load and unload things into the Audio player.
 *
 * Use the `player` property to access the underlying audio player.
 */
export default class TrackManager {

  constructor() {
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
  createTrack(url) {

    const track = new Track(url);

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
      }
    });

    return track;
  }

  /**
   * Make track active, and the current track inactive.
   * @param {Track} track
   */
  activate(track) {
    if (this.activeTrack === track) {
      return;
    }

    if (this.activeTrack) {
      this.activeTrack.pause();
      // track is paused asynchonously, so new src is set before pause event is fired.
      this.activeTrack.handlePaused();
      this.activeTrack.handleActiveChange(false);
    }

    this.activeTrack = track;

    if (track) {
      this.player.setSrc(track.url);
      track.handleActiveChange(true);
    }

  }
}