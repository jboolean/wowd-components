//@flow

import moment from 'moment';

import type { Airing, Dj } from './Types';

const dateTimeFormat = 'YYYY-MM-DD HH:mm';

export default function collateByAiring(shows : []) : Airing[] {
  const airings = [];
  shows
    .filter(show => show.ShowArchives && show.ShowArchives.length)
    .forEach(show => {
      const djs : Dj[] = (show.ShowDJs || []).map(dj => ({
        id: dj.DJID,
        name: dj.DJName,
        imageUrl: dj.DJImageURL
      }));
      show.ShowArchives.forEach(archive => {
        const onAirAt = moment(archive.Date + ' ' + show.StartTime, dateTimeFormat);
        const offAirAt = moment(archive.Date + ' ' + show.EndTime, dateTimeFormat);
        airings.push({
          showId: show.ShowID,
          showName: show.ShowName,
          showDescription: show.Description,
          djs,
          onAirAt,
          offAirAt,
          audioUrl: archive.AudioURL
        });
      });
    });
  airings.sort((a, b) => b.onAirAt.unix() - a.onAirAt.unix());
  return airings;
}