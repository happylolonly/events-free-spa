import React, { PropTypes } from 'react';

import './Loader.css';


const propTypes = {

}

const Loader = () => {
  return (
    <div className="loader">
      <div className="sk-chasing-dots">
        <div className="sk-child sk-dot1"></div>
        <div className="sk-child sk-dot2"></div>
      </div>

      <div>Подожди немного...</div>
    </div>
  )
}

Loader.propTypes = propTypes;

export default Loader;
