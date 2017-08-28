import React, { PropTypes } from 'react';

import ModerateListItem from '../ModerateListItem/ModerateListItem';

import './ModerateList.css';


const propTypes = {
  events: PropTypes.array.isRequired,
  // moderateEvent
}

const ModerateList = ({ events, moderateEvent }) => {
  return (
    <div className="moderate-list">
      {events.map(item => {
        const { _id: id, text } = item;
        console.log(id);
        return (
          <ModerateListItem
            key={id}
            id={id}
            text={text}
            moderateEvent={moderateEvent}
          />
        )
      })}
    </div>
  )
}

ModerateList.propTypes = propTypes;

export default ModerateList;
