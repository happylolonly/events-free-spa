import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import EventDetailFooter from './EventDetailFooter/EventDetailFooter';

import EventText from './EventText';
import * as browserHistory   from 'react-router-dom';

import moment from 'moment';

import './EventDetail.scss';


const propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired,
  images: PropTypes.array,
  // contacts
  // location id
}

const EventDetail = ({ title, text, date, images, contacts, location, id, ...rest }) => {
  console.log(rest);
  console.log(document.referrer);
  console.log(window.location);
  return (
    <div className="event-detail">
      <h3>{title}</h3>
      <header>
        {/* <Link to="/events"><span></span>Вернуться</Link> */}
        <a href="/events" onClick={(event) => {
          event.preventDefault();

          // console.log(browserHistory);
          //   debugger;

          if (window.history.length < 2) {

            window.location.pathname = '/events';
            
            // browserHistory.push('events');
          } else {

            window.history.back();
          }
        }}><span></span>Вернуться</a>
        <span>{moment(date).lang('ru').format('HH:mm') !== '00:00' ? moment(date).lang('ru').format('D MMMM YYYY в HH:mm') : moment(date).lang('ru').format('D MMMM YYYY')}</span>
      </header>
      <section>

        {images && images.map(item => {
          // const { src, description } = item;

          function is_cached(src) {
            var image = new Image();
            image.src = src;
        
            return image.complete;
        }


        if (!navigator.onLine && !is_cached(item)) return null;

       
          return <img key={item} src={item} alt={item} />
        })}

        <EventText text={text} />


        <hr/>

        <EventDetailFooter
          location={location}
          contacts={contacts}
          id={id}
          title={title}
          image={(images && images[0]) || ''}
        />
        
      </section>


    </div>
  )
}

EventDetail.propTypes = propTypes;

export default EventDetail;
