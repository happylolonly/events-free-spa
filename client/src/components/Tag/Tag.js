import React from 'react';
import PropTypes from 'prop-types';

import './Tag.scss';

const propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

const Tag = ({ text, ...rest }) => {
  return (
    <div className="tag" {...rest}>
      {text}
    </div>
  );
};

Tag.propTypes = propTypes;

export default Tag;
