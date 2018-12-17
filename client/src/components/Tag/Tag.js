import React from 'react';
import './Tag.scss';
import PropTypes from 'prop-types';

const propTypes = {
  text: PropTypes.string.isRequired
}

const Tag = ({ text }) => {
  return (
    <div className="tag">
      {text}
    </div>
  );
};

Tag.prototype = propTypes;

export default Tag;
