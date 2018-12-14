import React from 'react';
import PropTypes from 'prop-types';

import EventItem from 'components/EventItem/EventItem';

// import './TodayPage.scss';


const propTypes = {
  events: PropTypes.array.isRequired,
  currentFilter: PropTypes.string.isRequired,
}

const TodayPage = ({ events, currentFilter, handleMouseOver }) => {
  const showTitle = () => {
    switch (currentFilter) {
      case 'today':
        return <h3>Мероприятия на сегодня</h3>
      case 'tomorrow':
        return <h3>Мероприятия на завтра</h3>
      case 'certain':

      if (!window.location.search) { // /events => certain
        return <h3>Все мероприятия</h3>
      }
        const [ day, month ] = window.location.search.split('=')[1].split('_');

        if (!month) { // перерендер до колбека setState
          return <h3>Все мероприятия</h3>
        }

        const monthRU = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];

        return <h3>Мероприятия на {`${+day} ${monthRU[+month - 1].toLowerCase()}`}</h3>
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

            mouseOver={() => handleMouseOver(id) }
            adminMode={false}
          />
        )
      })}
    </div>
  )
}

TodayPage.propTypes = propTypes;

export default TodayPage;
