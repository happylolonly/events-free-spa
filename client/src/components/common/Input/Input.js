import React from 'react';
import PropTypes from 'prop-types';

import './Input.scss';


const propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,

    error: PropTypes.string
};

const Input = ({ value, name, placeholder, onChange, title, error }) => {

    function handleChange(event) {
        const { value } = event.target;
        onChange(value, name, event);
    }

    return (
        <div className="form-group">
            <label htmlFor={name}>{title}</label>
            <input
                className="form-control"
                type="text"
                id={name}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={handleChange}
            />

            {error && <div className="error">{error}</div>}
        </div>

    );
};

Input.propTypes = propTypes;

export default Input;
