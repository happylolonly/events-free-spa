import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import EventDetailFooter from './EventDetailFooter/EventDetailFooter';
import Tags from './Tags/Tags';
import Moderation from './Moderation/Moderation';

import EventText from './EventText';

import moment from 'moment';

import './EventDetail.scss';

const propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired,
  images: PropTypes.array,
  tags: PropTypes.array.isRequired,
  // contacts
  // location id
  // routerLocation
  // routerHistory
};

const EventDetail = ({
  title,
  text,
  date,
  images,
  contacts,
  location,
  id,
  routerHistory,
  routerLocation,
  tags,
  ...rest
}) => {
  // maybe move in container
  const isAdmin = routerLocation.pathname.includes('check');

  return (
    <div className="event-detail">
      <h3>{title}</h3>
      <header>
        <a
          href="/events"
          onClick={event => {
            // не Link чтобы учитывался скрол браузером
            event.preventDefault();

            if (routerHistory.length < 2) {
              routerHistory.push('/events');
            } else {
              routerHistory.goBack();
            }
          }}
        >
          <span />
          Вернуться
        </a>

        <span>
          {moment(date)
            .lang('ru')
            .format('HH:mm') !== '00:00'
            ? moment(date)
              .lang('ru')
              .format('D MMMM YYYY в HH:mm')
            : moment(date)
              .lang('ru')
              .format('D MMMM YYYY')}
        </span>
      </header>
      <section>
        {images &&
          images.map(item => {
            // const { src, description } = item;

            function is_cached(src) {
              var image = new Image();
              image.src = src;

              return image.complete;
            }

            if (!navigator.onLine && !is_cached(item)) return null;

            return <img key={item} src={item} alt={item} className="event-detail__event-img" />;
          })}

        <EventText text={text} />

        {/* {<hr/>} */}

        <Tags id={id} tags={tags} adminMode={isAdmin} routerHistory={routerHistory} />

        <hr />

        <EventDetailFooter
          location={location}
          contacts={contacts}
          id={id}
          title={title}
          image={(images && images[0]) || ''}
        />

        {isAdmin && <Moderation id={id} routerHistory={routerHistory} />}
      </section>
    </div>
  );
};

EventDetail.propTypes = propTypes;

export default EventDetail;
