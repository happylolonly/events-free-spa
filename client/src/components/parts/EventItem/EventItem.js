import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import moment from 'moment';

import './EventItem.css';


const propTypes = {
  date: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,

  originalLink: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
}

const EventItem = ({ date, title, link, originalLink, source }) => {
  // console.log(link);
  return (
    <div className="event-item">
      <header>
        <Link to={`/event/${link}`}>{title}</Link>
        <div>
          <span className="date">{moment(date).lang('ru').format('D MMMM YYYY')}</span>
          <span className="time">{moment(date).lang('ru').format('HH:mm') !== '00:00' ? moment(date).lang('ru').format('HH:mm') : 'Время не указано'}</span>
        </div>
      </header>
      <p className="source">Источник: <a target="_blank" href={`http://${source}${originalLink}`}>{source}</a></p>

    </div>
  )
}

EventItem.propTypes = propTypes;

export default EventItem;
