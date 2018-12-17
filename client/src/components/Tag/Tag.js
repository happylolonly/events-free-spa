import React from 'react';
import './Tag.scss';

const Tag = ({ text }) => {
  return (
    <div className="awesom-tag">
      {text}
    </div>
  );
};

export default Tag;
