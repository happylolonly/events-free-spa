import React from 'react';
import PropTypes from 'prop-types';

import './Checkbox.scss';

const propTypes = {
  title: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  text: PropTypes.string,
};

const Checkbox = ({ name, value, onChange, text }) => {
  const handleChange = event => {
    onChange(event.target.checked, name);
  };
  return (
    <div className="checkbox">
      <label>
        <input name={name} type="checkbox" onChange={handleChange} checked={value} />

        {text}
      </label>
    </div>
  );
};

Checkbox.propTypes = propTypes;

export default Checkbox;
