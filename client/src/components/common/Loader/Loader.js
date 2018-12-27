import React from 'react';
import PropTypes from 'prop-types';

import './Loader.scss';

const propTypes = {};

const Loader = () => {
  return (
    <div className="loader">
      <div className="sk-chasing-dots">
        <div className="sk-child sk-dot1" />
        <div className="sk-child sk-dot2" />
      </div>

      <div>Подожди немного...</div>
    </div>
  );
};

Loader.propTypes = propTypes;

export default Loader;
