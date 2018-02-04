import React from 'react';
import PropTypes from 'prop-types';

import './Location.scss';


const propTypes = {
//locaton
}

const Location = ({ location }) => {
  return (
    <div className="location">
      <h5>Место</h5>
      <p>{location}</p>
      <a href="#">Показать на карте</a>
    </div>
  )
}

Location.propTypes = propTypes;

export default Location;
