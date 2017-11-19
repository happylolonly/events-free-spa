import React from 'react';
import PropTypes from 'prop-types';

import './Location.css';


const propTypes = {
//locaton
}

const Location = ({ location }) => {
  return (
    <div className="location">
      <h5>Место</h5>
      <p>{location}</p>
    </div>
  )
}

Location.propTypes = propTypes;

export default Location;
