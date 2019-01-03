import React from 'react';
import PropTypes from 'prop-types';

import './Textarea.scss';

const propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,

  error: PropTypes.string,
};

const Textarea = ({ value, name, placeholder, title, onChange, error }) => {
  function handleChange(event) {
    const { value } = event.target;
    onChange(value, name, event);
  }

  return (
    <div className="textarea form-group">
      <label htmlFor={name}>{title}</label>
      <textarea
        className="form-control"
        defaultValue={value}
        value={value}
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
      />

      {error && <div className="error">{error}</div>}
    </div>
  );
};

Textarea.propTypes = propTypes;

export default Textarea;
