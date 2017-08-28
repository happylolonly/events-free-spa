import React, { PropTypes } from 'react';

import './Checkbox.css';


const propTypes = {
  title: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  text: PropTypes.string,
}

const Checkbox = ({ name, value, onChange, text }) => {
  const handleChange = (event) => {
    onChange(name, event.target.checked);
  }
  return (
    <div className="checkbox">
      <label>
        <input
          name={name}
          type="checkbox"
          onChange={handleChange}
          checked={value}
        />

        {text}
      </label>

    </div>
  )
}

Checkbox.propTypes = propTypes;

export default Checkbox;
