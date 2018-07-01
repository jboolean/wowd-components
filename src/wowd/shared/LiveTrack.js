// @flow
import type { TrackMetadata } from 'utils/Types';
import TrackManagerSingleton from 'TrackManager';
import TrackManagerType from 'TrackManager/TrackManager';
const TrackManager = (TrackManagerSingleton: TrackManagerType<TrackMetadata>);
import axios from 'axios';
import moment from 'moment';

const INTERVAL = 5000;
const STREAM_URL = 'http://live2.takomaradio.org/stream';
const NOW_PLAYING_URL = 'https://files.takomaradio.org/spinitron/api.php';

const getNowPlayingData = () => {
  return axios.get(NOW_PLAYING_URL)
    .then((resp) => resp.data);
};

const defaultMetadata : TrackMetadata = {
  showName: 'Takoma Radio',
  isLive: true,
  djs: [],
  onAirAt: null,
  song: null
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
      name: data.DJName,
      imageUrl: null
    }],
    song,
    isLive: true,
    onAirAt: moment()
  });
};

const doUpdateCycle = () => {
  if (!liveTrack.isActive) {
    liveTrack.once('active', () => {doUpdateCycle();});
    return;
  }
  return getNowPlayingData()
    .then(updateNowPlaying)
    .then(() =>
      setTimeout(doUpdateCycle, INTERVAL)
      ,
    (err) => {
      console.error('Error updating Now Playing', err);
      setTimeout(doUpdateCycle, INTERVAL * 2);
    });
};

doUpdateCycle();

export default liveTrack;