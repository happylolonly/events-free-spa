import React from 'react';
import PropTypes from 'prop-types';

import Search from './Search/Search';
import EventList from './EventList/EventList';

import './WeekEvents.scss';


const propTypes = {
    events: PropTypes.array.isRequired,
    week: PropTypes.oneOf(['current', 'next']).isRequired,
    words: PropTypes.string.isRequired,
    handleSeachChange: PropTypes.func.isRequired,
    handleSearchButtonClick: PropTypes.func.isRequired,
};

const WeekEvents = ({ events, week, words, handleSeachChange, handleSearchButtonClick }) => {
  return (
    <div className="week-events">
        
        <Search
            week={week}
            words={words}
            handleData={handleSeachChange}
            handleClick={handleSearchButtonClick}
        />

        <EventList events={events} />
    </div>
  );
};

WeekEvents.propTypes = propTypes;

export default WeekEvents;
