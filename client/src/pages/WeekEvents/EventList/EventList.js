import React from 'react';
import PropTypes from 'prop-types';

import Event from './Event/Event';
import moment from 'moment';

// import './EventList.scss';


const propTypes = {
    events: PropTypes.array.isRequired,
};

const EventList = ({ events }) => {

  // const filteredEvents = [];

  // function prepareEvents (events) {

  //   events.forEach(item => {

  //     filteredEvents
      
  //     switch (day) {
  //       case 'Monday':
          
  //         break;
      
  //       default:
  //         break;
  //     }
  //   });

  // } 

  return (
    <div className="events-list">

        {/* {filteredEvents.map(item => {
          const { day, events } = item;
          return (
            <div key={day}>
              {day}

              {events.map(item2 => {
                const { id, title } = item2;
                return (
                  <Event id={id} title={title} />
                )
              })}

            </div>
          )
        
        })} */}


        {events.map(item => {
          const { _id: id, title, date } = item;
          return (
            <div>
              <span>{moment(date).format('DD MMMM')}</span>
              <Event key={id} id={id} title={title} />
            </div>
          )
        })}
      
    </div>
  );
};

EventList.propTypes = propTypes;

export default EventList;
