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
import ReactDOM from 'react-dom';
import throttle from 'lodash/throttle';

type Props<T> = {
  blocks: BlockData<T>[],
  className?: string,
  height: number,
  dayStartsAt: LocalTime,
  renderBlock: React.ComponentType<{block: BlockData<T>}>,
  dayClassName?: string
};

const addWeekdays = (day: DayOfWeek, daysToAdd: number): DayOfWeek => {
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

const createHourlyBlocks = (dayStartsAt: LocalTime, latestTime: LocalTime): BlockData<LocalTime>[] => {
  const blocks = [];
  for (let i = dayStartsAt.millis; i < LocalTime.MAX.millis; i += HOUR_MS) {
    const curTime = new LocalTime(i);
    // MONDAY is arbitrary.
    const start = WeeklyDayTime.of(DayOfWeek.MONDAY, curTime);
    const end = WeeklyDayTime.of(DayOfWeek.MONDAY, new LocalTime(i + HOUR_MS));
    const data = { 'default': [{ start, end, data: start.time }] };
    blocks.push(new BlockData(start, end, data));
  }
  for (let i = 0; i <= latestTime.millis; i += HOUR_MS) {
    const curTime = new LocalTime(i);
    const start = WeeklyDayTime.of(DayOfWeek.TUESDAY, curTime);
    const end = WeeklyDayTime.of(DayOfWeek.TUESDAY, new LocalTime(i + HOUR_MS));
    const data = { 'default': [{ start, end, data: start.time }] };
    blocks.push(new BlockData(start, end, data));
  }
  return blocks;
};


export default class Schedule<T> extends React.Component<Props<T>, {activeDay: DayOfWeek}> {
  weekEl: HTMLElement;
  updateDayListener: (*) => void;
  dayElements: {[$Values<DayOfWeek>]: ?Day<T>}
  constructor(props: Props<T>) {
    super(props);
    this.state = { activeDay: new Date().getDay() + 1 };
  }

  componentDidMount() {
    this.scrollToDay(this.state.activeDay);
    this.weekEl.addEventListener('scroll', this.updateDayListener = throttle(this.updateActiveDay.bind(this), 300));
  }

  componentWillUnmount() {
    this.weekEl.removeEventListener('scroll', this.updateDayListener);
  }

  updateActiveDay() {
    for (let day of Object.values(DayOfWeek)) {
      const dayNode = ((ReactDOM.findDOMNode(this.dayElements[day]): any): HTMLElement);
      const dayWidth = dayNode.getBoundingClientRect().width;
      if (dayNode && (dayNode.offsetLeft - this.weekEl.offsetLeft + dayWidth / 2) >= this.weekEl.scrollLeft) {
        this.setState({ activeDay: day });
        return;
      }
    }
  }

  scrollToDay(day: $Values<DayOfWeek>) {
    const dayNode = ((ReactDOM.findDOMNode(this.dayElements[day]): any): HTMLElement);
    this.weekEl.scrollLeft = dayNode.offsetLeft - this.weekEl.offsetLeft;
  }

  render() {
    const { blocks, height, dayStartsAt, dayClassName, renderBlock } = this.props;
    const { activeDay } = this.state;
    this.dayElements = {};

    // Allocate blocks to days.
    // The start of the day can be customized.
    // Events occuring before the start of the day are shown on the previous day.
    let earliestTime = LocalTime.MAX;
    let latestTime = dayStartsAt;
    const blocksByDay = {};
    Object.values(DayOfWeek).forEach((dayOfWeek: DayOfWeek) => {
      blocksByDay[dayOfWeek] = [];
    });
    blocks.forEach(block => {
      const allocateToYesterday = block.start.time.compareTo(dayStartsAt) < 0;
      const allocatedDay = allocateToYesterday ?
        addWeekdays(block.start.weekday, -1) : block.start.weekday;
      if (!allocateToYesterday && block.start.time.compareTo(earliestTime) < 0) {
        earliestTime = block.start.time;
      }
      if (allocateToYesterday && block.end.time.compareTo(latestTime) < 0) {
        latestTime = block.end.time;
      }
      blocksByDay[allocatedDay].push(block);
    });

    return (
      <div className={cx(stylesheet.container, this.props.className)} style={{ height: height }}>
        <div className={stylesheet.dayNames}>
          {Object.values(DayOfWeek).map((dayOfWeek: DayOfWeek) =>
            (<div
              key={dayOfWeek}
              onClick={() => this.scrollToDay(dayOfWeek)}
              className={cx({ [stylesheet.active]: dayOfWeek === activeDay })}>
              {DayNames[dayOfWeek]}
            </div>))}
        </div>
        <div className={stylesheet.weekTimesContainer} >
          <Day
            blocks={createHourlyBlocks(earliestTime, latestTime)}
            start={WeeklyDayTime.of(DayOfWeek.MONDAY, earliestTime)}
            end={WeeklyDayTime.of(DayOfWeek.TUESDAY, latestTime)}
            renderBlock={({ block: blockData }) => formatLocalTime(blockData.alternatives.default[0].data, true)}
            className={stylesheet.times}
          />
          <div className={stylesheet.week} ref={(el) => {if (el) {this.weekEl = el;}}}>
            {Object.values(DayOfWeek).map((dayOfWeek: DayOfWeek) =>
              (
                <Day
                  ref={(dayEl) => {this.dayElements[dayOfWeek] = dayEl;}}
                  key={dayOfWeek}
                  blocks={blocksByDay[dayOfWeek]}
                  start={WeeklyDayTime.of(dayOfWeek, earliestTime)}
                  end={WeeklyDayTime.of((dayOfWeek + 1) % 7, latestTime)}
                  renderBlock={renderBlock}
                  className={dayClassName}
                />
              ))}
          </div>
        </div>
      </div>
    );

  }
}