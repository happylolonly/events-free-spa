import React from 'react';
import PropTypes from 'prop-types';

import './Select.scss';

const propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onChange: PropTypes.func.isRequired,

  error: PropTypes.string,
};

const Select = ({ value, name, placeholder, onChange, title, options, error }) => {
  function handleChange(event) {
    const { value } = event.target;
    onChange(value, name, event);
  }

  function renderOptions() {
    if (Array.isArray(options)) {
      return options.map(item => {
        return (
          <option key={item} value={item}>
            {' '}
            {item}
          </option>
        );
      });
    } else {
      return Object.keys(options).map(item => {
        return (
          <option key={item} value={item}>
            {' '}
            {options[item]}
          </option>
        );
      });
    }
  }

  return (
    <div className="form-group">
      <label htmlFor={name}>{title}</label>
      <select
        className="form-control"
        type="text"
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
      >
        <option value="">Select {(title && title.toLowerCase()) || name}</option>
        {renderOptions()}
      </select>

      {error && <div className="error">{error}</div>}
    </div>
  );
};

Select.propTypes = propTypes;

export default Select;
