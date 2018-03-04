// @flow
import * as React from 'react';
import PlayButton from 'components/PlayButton';
import type { EpisodeSummary } from 'util/Types';


type Props = {
  episode: EpisodeSummary
};

const ordinalPattern = /(?:[0-9])(st|nd|rd|th)/;

const renderDate = (date) => {
  const string = date.format('MMMM Do');
  const matchResult = string.match(ordinalPattern);
  if (!matchResult) {
    // error case
    return <time dateTime={date.format()}>{string}</time>;
  }
  const ordinal = matchResult[1];
  return (<time dateTime={date.format()}>
    {string.replace(ordinal, '')}<sup>{ordinal}</sup>
  </time>);
};

export default class ShowEpisode extends React.Component<Props> {
  render() {
    const { episode } = this.props;
    if (!episode.track) {
      throw 'Episode must have a track';
    }
    return (
      <div>
        <PlayButton
          track={episode.track}
          theme="dark"
          size="small"
        />
        <span>{renderDate(episode.onAirAt)}</span>
      </div>
    );
  }
}