//@flow

import moment from 'moment';
import type { Show, ShowEpisode, Dj } from './Types';
import TrackManager from 'TrackManager';

const dateTimeFormat = 'YYYY-MM-DD HH:mm';

export default function(apiShows : []) : Show[] {
  const results : Show[] = [];
  apiShows.forEach(apiShow => {
    const djs : Dj[] = (apiShow.ShowDJs || []).map(dj => ({
      id: dj.DJID,
      name: dj.DJName,
      imageUrl: dj.DJImageURL
    }));
    const episodes : ShowEpisode[] = (apiShow.ShowArchives || []).map(archive => {
      const onAirAt = moment(archive.Date + ' ' + apiShow.StartTime, dateTimeFormat);
      const offAirAt = moment(archive.Date + ' ' + apiShow.EndTime, dateTimeFormat);
      const audioUrl = archive.AudioURL;
      const track = TrackManager.createTrack(audioUrl);
      return {
        onAirAt,
        offAirAt,
        audioUrl,
        track
      };
    });
    episodes.sort((a, b) => b.onAirAt.unix() - a.onAirAt.unix());
    const show = {
      id: apiShow.ShowID,
      description: apiShow.Description,
      name: apiShow.ShowName,
      djs,
      episodes
    };
    results.push(show);
  });
  results.sort((a, b) => a.name.localeCompare(b.name));
  return results;
}