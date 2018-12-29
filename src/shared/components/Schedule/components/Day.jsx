// @flow
import * as React from 'react';
import BlockData from '../Block';
import WeeklyDayTime from 'utils/time/WeeklyDayTime';
import getMillisBetween from 'utils/getMillisBetween';
import cx from 'classnames';

type Props<T> = {
  blocks: BlockData<T>[],
  start: WeeklyDayTime,
  end: WeeklyDayTime,
  renderBlock: React.ComponentType<{block: BlockData<T>}>,
  className?: string
};

import stylesheet from 'Schedule.less';

export default class Day<T> extends React.Component<Props<T>> {
  renderBlock(block: BlockData<T>) {
    const { renderBlock: BlockContainer } = this.props;
    const timeInDay = getMillisBetween(this.props.start, this.props.end);

    const blockStartMillis = getMillisBetween(this.props.start, block.start);
    const blockEndMillis = getMillisBetween(this.props.start, block.end);

    const top = (blockStartMillis / timeInDay * 100) + '%';
    const duration = blockEndMillis - blockStartMillis;
    const height = (duration / timeInDay * 100) + '%';
    const minHeight = (900000 / timeInDay * 100) + '%';
    return (<div
      style={{
        top: top,
        height: height,
        minHeight: minHeight
      }}
      className={stylesheet.blockContainer}
      key={blockStartMillis}>
      <BlockContainer block={block} />
    </div>);
  }

  render() {
    const { blocks, className } = this.props;
    return (
      <div className={cx(stylesheet.day, className)}>
        {blocks.map(block => this.renderBlock(block))}
      </div>
    );
  }
}