import React, { PropTypes } from 'react';

import './EventText.scss';


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
