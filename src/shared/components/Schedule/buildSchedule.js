// @flow

import type WeeklyDayTime from 'util/time/WeeklyDayTime';
import Block from './Block';

export type WeeklySchedule<T> = Block<T>[];

export type timeAccessor<T> = (event: T) => {
  start: WeeklyDayTime,
  end: WeeklyDayTime,
  alternationId: string
}[];

function comesBeforeOrOverlaps<T>(a: Block<T>, b: Block<T>): boolean {
  return a.start.compareTo(b.start) <= 0 || b.overlaps(a);
}

function insertBlock<T>(schedule: WeeklySchedule<T>, newBlock: Block<T>) {
  /*
  For each event, find existing blocks to merge with, replace those blocks with the merged block.
  Since all overlapping blocks must be consecutive, they can all be splice out together and replaced.
   */
  let startInserting = null;
  let numToSpliceOut = 0;
  // todo this could be a binary search
  for (let i = 0; i < schedule.length; i++) {
    const block = schedule[i];
    // Find place this block goes
    if (startInserting === null && comesBeforeOrOverlaps(newBlock, block)) {
      startInserting = i;
    }

    // if a block is found that overlaps, the new block incorporates that block,
    // and the existing block is marked for removal
    if (block.overlaps(newBlock)) {
      newBlock = newBlock.merge(block);
      numToSpliceOut++;
    }

    if (block.start.compareTo(newBlock.end) > 0) {
      // all further blocks must be non-conflicting
      break;
    }
  }
  if (startInserting === null) {
    startInserting = schedule.length;
  }

  schedule.splice(startInserting || 0, numToSpliceOut, newBlock);
}

/**
 * Collates events into list of "Blocks", which help support events that occur at the same time,
 * on different weeks.
 * A block is a block of time.
 * A block contains a set of "alternatives". An "alternative" represents
 * a schedule in a particular week. If events operate on a odd/even schedule there will be 2 alternatives.
 * Each alternative is a list of events.
 *
 * The blocks are made as small as possible where there are overlapping events,
 * and may may encompass several events per alternative.
 *
 * @param {T} input events events objects of any type.
 * @param {function} dataAccessor function to extract timing data from an event.
 *                                returs a list of times this event occurs.
 */
export default function buildSchedule<T>(events: T[], dataAccessor: timeAccessor<T>): WeeklySchedule<T> {
  const schedule = [];

  for (let eventData of events) {
    for (let occurrance of dataAccessor(eventData)) {
      const event = {
        start: occurrance.start,
        end: occurrance.end,
        data: eventData
      };
      // Create a block just for this new event
      let newBlock : Block<T> = new Block(
        occurrance.start,
        occurrance.end,
        { [occurrance.alternationId]: [event] }
      );

      insertBlock(schedule, newBlock);
    }
  }

  return schedule;
}