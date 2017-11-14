import React from 'react';
import PropTypes from 'prop-types';

import EventItem from 'components/EventItem/EventItem';

// import './TodayPage.scss';


const propTypes = {
  events: PropTypes.array.isRequired,
  currentFilter: PropTypes.string.isRequired,
}

const TodayPage = ({ events, currentFilter }) => {
  const showTitle = () => {
    switch (currentFilter) {
      case 'today':
        return <h3>Мероприятия на сегодня</h3>
      case 'tomorrow':
        return <h3>Мероприятия на завтра</h3>
      case 'past':
        return <h3>Прошедшие мероприятия</h3>
      default:
        return <h3>Все мероприятия</h3>
    }
  }
  return (
    <div className="today-page">
      {showTitle()}
      {events.map(item => {
        const { date, title, id, originalLink, source } = item;
        return (
          <EventItem
            key={id}

            date={date}
            title={title}
            link={id}
            originalLink={originalLink}
            source={source}
          />
        )
      })}
    </div>
  )
}

TodayPage.propTypes = propTypes;

export default TodayPage;
