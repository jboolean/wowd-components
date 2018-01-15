// @flow
import type { TrackMetadata } from 'util/Types';
import TrackManagerSingleton from 'TrackManager';
import TrackManagerType from 'TrackManager/TrackManager';
const TrackManager = (TrackManagerSingleton : TrackManagerType<TrackMetadata>);
import { get } from 'axios';

const INTERVAL = 5000;
const STREAM_URL = 'http://live2.takomaradio.org/stream';
const NOW_PLAYING_URL = 'https://files.takomaradio.org/spinitron/api.php';

const getNowPlayingData = () => {
  return get(NOW_PLAYING_URL)
    .then((resp) => resp.data);
};

const defaultMetadata : TrackMetadata = {
  showName: 'Takoma Radio',
  isLive: true,
  djs: []
};

const liveTrack = TrackManager.createTrack(STREAM_URL, defaultMetadata);

const updateNowPlaying = (data) => {
  let song = null;
  if (data.SongName) {
    song = {
      name: data.SongName,
      artist: data.ArtistName,
      album: data.DiskName
    };
  }
  liveTrack.setMetadata({
    showName: data.ShowName,
    djs: [{
      id: -1,
      name: data.DJName
    }],
    song,
    isLive: true
  });
};

const doUpdateCycle = () => {
  if (!liveTrack.isActive) {
    liveTrack.once('active', doUpdateCycle);
    return;
  }
  return getNowPlayingData()
    .then(updateNowPlaying)
    .catch((err) =>
      console.error('Error updating Now Playing', err)
    )
    .then(() =>
      setTimeout(doUpdateCycle, INTERVAL)
    );
};

doUpdateCycle();

export default liveTrack;