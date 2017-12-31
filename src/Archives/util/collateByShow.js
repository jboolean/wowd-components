//@flow

import moment from 'moment';
import type { Show, ShowAiring, Dj } from './Types';

const dateTimeFormat = 'YYYY-MM-DD HH:mm';

export default function(apiShows : []) : Show[] {
  const results : Show[] = [];
  apiShows.forEach(apiShow => {
    const djs : Dj[] = (apiShow.ShowDJs || []).map(dj => ({
      id: dj.DJID,
      name: dj.DJName,
      imageUrl: dj.DJImageURL
    }));
    const airings : ShowAiring[] = (apiShow.ShowArchives || []).map(archive => {
      const onAirAt = moment(archive.Date + ' ' + apiShow.StartTime, dateTimeFormat);
      const offAirAt = moment(archive.Date + ' ' + apiShow.EndTime, dateTimeFormat);
      const audioUrl = archive.AudioURL;
      return {
        onAirAt,
        offAirAt,
        audioUrl
      };
    });
    const show = {
      id: apiShow.ShowID,
      description: apiShow.Description,
      name: apiShow.ShowName,
      djs,
      airings
    };
    results.push(show);
  });
  results.sort((a, b) => a.name.localeCompare(b.name));
  return results;
}