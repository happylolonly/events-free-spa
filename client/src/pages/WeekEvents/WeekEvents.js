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

    weekError: PropTypes.string,
    wordsError: PropTypes.string,
};

const WeekEvents = ({ events, week, words, handleSeachChange, handleSearchButtonClick, weekError, wordsError }) => {
  return (
    <div className="week-events">

        <h3>Мероприятия на неделю</h3>
        
        <Search
            week={week}
            words={words}
            handleData={handleSeachChange}
            handleClick={handleSearchButtonClick}

            weekError={weekError}
            wordsError={wordsError}
        />

        {events.length ?
            <EventList events={events} /> :
            <div>Ничего не найдено :(</div> 
        }

    </div>
  );
};

WeekEvents.propTypes = propTypes;

export default WeekEvents;
