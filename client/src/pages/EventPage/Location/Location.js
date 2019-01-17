import React from 'react';
import PropTypes from 'prop-types';
import './Location.scss';

const propTypes = {
  location: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  isShowMap: PropTypes.bool.isRequired,
};

const defaultProps = {
  location: '',
};

const Location = ({ location, onClick, isShowMap }) => (
  <div className="location">
    <span className="location__title">Место: </span>
    <span>{location}</span>
    <button className="location__btn" onClick={onClick}>
      {!isShowMap ? 'Показать на карте' : 'Скрыть'}{' '}
    </button>
  </div>
);

Location.propTypes = propTypes;
Location.defaultProps = defaultProps;

export default Location;
