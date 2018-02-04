import React from 'react';
import PropTypes from 'prop-types';

import './ScrollUpButton.scss';


const propTypes = {

};

const ScrollUpButton = () => {
  
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="scroll-up-button" onClick={handleClick}>
      dfl;dfl;d
    </div>
  );
};

ScrollUpButton.propTypes = propTypes;

export default ScrollUpButton;
