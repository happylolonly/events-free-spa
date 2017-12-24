import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import EventText from './EventText';
import Location from './Location/Location';
import Contacts from './Contacts/Contacts';

import SocialButtons from '../../components/SocialButtons/SocialButtons';

import moment from 'moment';

import './EventDetail.css';


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
        <Link to="/today"><span></span>Вернутся</Link>
        <span>{moment(date).lang('ru').format('HH:mm') !== '00:00' ? moment(date).lang('ru').format('D MMMM YYYY в HH:mm') : moment(date).lang('ru').format('D MMMM YYYY')}</span>
      </header>
      <section>

        {images && images.map(item => {
          // const { src, description } = item;
          return <img key={item} src={item} alt={item} />
        })}

        <EventText text={text} />

        <hr/>

        <div className="additional-info">
          <SocialButtons
            link={`http://www.eventsfree.by/event/${id}`}
            title={title}
            isShowCount={false}
          />
          {contacts && Object.keys(contacts).length > 0 && <Contacts contacts={contacts} />}
          {location && <Location location={location}   />}
        </div>
      </section>


    </div>
  )
}

EventDetail.propTypes = propTypes;

export default EventDetail;
