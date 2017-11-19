import React, { PropTypes } from 'react';

import './EventText.css';


const propTypes = {
  // text

}

const EventText = ({ text }) => {
  return (
    <div className="event-text" dangerouslySetInnerHTML={ {__html: text} }></div>
  )
}

EventText.propTypes = propTypes;

export default EventText;
