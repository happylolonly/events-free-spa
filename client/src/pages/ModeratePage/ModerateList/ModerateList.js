import React from 'react';
import PropTypes from 'prop-types';

import ModerateListItem from '../ModerateListItem/ModerateListItem';

import './ModerateList.scss';

const propTypes = {
  events: PropTypes.array.isRequired,
  // moderateEvent
};

const ModerateList = ({ events, moderateEvent }) => {
  return (
    <div className="moderate-list">
      {events.map(item => {
        const { _id: id, text, source } = item;
        return (
          <ModerateListItem
            key={id}
            id={id}
            text={text}
            source={source}
            moderateEvent={moderateEvent}
          />
        );
      })}
    </div>
  );
};

ModerateList.propTypes = propTypes;

export default ModerateList;
