import React from 'react';
import PropTypes from 'prop-types';
import './Dropdown.scss';

const propTypes = {
  items: PropTypes.array.isRequired,
  handleDropdownClick: PropTypes.func.isRequired,
};

const Dropdown = ({ items, handleDropdownClick }) => {
  const onClick = (item, e) => {
    handleDropdownClick(item, e);
  };

  return (
    <div className="dropdown">
      {items.map((text, i) => (
        <button className="dropdown__link" key={i} onClick={(e) => onClick(items[i], e)}>{text}</button>
      ))}
    </div>
  );
};

Dropdown.propTypes = propTypes;

export default Dropdown;
