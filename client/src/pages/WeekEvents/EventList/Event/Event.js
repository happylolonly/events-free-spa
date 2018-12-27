import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import './Event.scss';

const propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const Event = ({ id, title }) => {
  return (
    <div className="event">
      <Link to={`/event/${id}`}>{title}</Link>
    </div>
  );
};

Event.propTypes = propTypes;

export default Event;
