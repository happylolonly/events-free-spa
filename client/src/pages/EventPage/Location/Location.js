import React from 'react';
import PropTypes from 'prop-types';
import './Location.scss';

const Location = ({ location }) =>
  location ? (
    <div className="location">
      <span className="location__title">Место: </span>
      <span>{location}</span>
    </div>
  ) : null;

Location.propTypes = {
  location: PropTypes.string,
};

Location.defaultProps = {
  location: '',
};

export default Location;
