import React from 'react';
import PropTypes from 'prop-types';
import './Location.scss';

const propTypes = {
  location: PropTypes.string,
};

const defaultProps = {
  location: '',
};

const Location = ({ location, onClick, isShowMap }) => (
  <div className="location">
    <span className="location__title">Место: </span>
    <span>{location}</span>
    <br />
    <button className="btn--link" onClick={onClick}>
      {!isShowMap ? 'Показать на карте' : 'Скрыть'}{' '}
    </button>
  </div>
);

Location.propTypes = propTypes;
Location.defaultProps = defaultProps;

export default Location;
