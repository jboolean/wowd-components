// @flow
import * as React from 'react';

import BlockData from './Block';
import Day from './components/Day';
import DayOfWeek from 'util/time/DayOfWeek';
import stylesheet from './shared/Schedule.less';
import LocalTime from 'util/time/LocalTime';
import WeeklyDayTime from 'util/time/WeeklyDayTime';
import formatLocalTime from 'util/time/formatLocalTime';
import DayNames from 'util/time/DayNames';
import cx from 'classnames';

type Props<T> = {
  blocks : BlockData<T>[],
  className? : string,
  height: number,
  dayStartsAt : LocalTime,
  renderBlock : React.ComponentType<{block:BlockData<T>}>,
  dayClassName?: string
};

const addWeekdays = (day : DayOfWeek, daysToAdd : number) : DayOfWeek => {
  day += daysToAdd;
  while (day < 1) {
    day += 7;
  }
  while (day > 7) {
    day -= 7;
  }
  return day;
};

const HOUR_MS = 1000 * 60 * 60;

const createHourlyBlocks = (dayStartsAt : LocalTime) : BlockData<LocalTime>[] => {
  const blocks = [];
  for (let i = dayStartsAt.millis; i < LocalTime.MAX.millis; i += HOUR_MS) {
    const curTime = new LocalTime(i);
    // MONDAY is arbitrary.
    const start = WeeklyDayTime.of(DayOfWeek.MONDAY, curTime);
    const end = WeeklyDayTime.of(DayOfWeek.MONDAY, new LocalTime(i + HOUR_MS));
    const data = { 'default': [{ start, end, data: start.time }] };
    blocks.push(new BlockData(start, end, data));
  }
  for (let i = LocalTime.MAX.millis; i < dayStartsAt.millis; i += HOUR_MS) {
    const curTime = new LocalTime(i);
    const start = WeeklyDayTime.of(DayOfWeek.TUESDAY, curTime);
    const end = WeeklyDayTime.of(DayOfWeek.TUESDAY, new LocalTime(i + HOUR_MS));
    const data = { 'default': [{ start, end, data: start.time }] };
    blocks.push(new BlockData(start, end, data));
  }
  return blocks;
};


export default function Schedule<T>(props : Props<T>) {
  const { blocks, height, dayStartsAt, dayClassName } = props;

  // Allocate blocks to days.
  // The start of the day can be customized.
  // Events occuring before the start of the day are shown on the previous day.
  let earliestTime = LocalTime.MAX;
  const blocksByDay = {};
  Object.values(DayOfWeek).forEach((dayOfWeek : DayOfWeek) => {
    blocksByDay[dayOfWeek] = [];
  });
  blocks.forEach(block => {
    const allocateToYesterday = block.start.time.compareTo(dayStartsAt) < 0;
    const allocatedDay = allocateToYesterday ?
      addWeekdays(block.start.weekday, -1) : block.start.weekday;
    if (!allocateToYesterday && block.start.time.compareTo(earliestTime) < 0) {
      earliestTime = block.start.time;
    }
    blocksByDay[allocatedDay].push(block);
  });

  return (
    <div className={cx(stylesheet.container, props.className)} style={{ height: height }}>
      <div className={stylesheet.dayNames}>
        {Object.values(DayOfWeek).map((dayOfWeek : DayOfWeek) => <div key={dayOfWeek}>{DayNames[dayOfWeek]}</div>)}
      </div>
      <div className={stylesheet.week} >
        <Day
          blocks={createHourlyBlocks(earliestTime)}
          start={WeeklyDayTime.of(DayOfWeek.MONDAY, earliestTime)}
          end={WeeklyDayTime.of(DayOfWeek.TUESDAY, earliestTime)}
          renderBlock={({ block: blockData }) => formatLocalTime(blockData.alternatives.default[0].data, true)}
          className={stylesheet.times}
        />

        {Object.values(DayOfWeek).map((dayOfWeek : DayOfWeek) =>
          (
            <Day
              key={dayOfWeek}
              blocks={blocksByDay[dayOfWeek]}
              start={WeeklyDayTime.of(dayOfWeek, earliestTime)}
              end={WeeklyDayTime.of((dayOfWeek + 1) % 7, earliestTime)}
              renderBlock={props.renderBlock}
              className={dayClassName}
            />
          ))}
      </div>
    </div>
  );
}