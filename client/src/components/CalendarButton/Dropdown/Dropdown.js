import React from 'react';
import PropTypes from 'prop-types';
import './Dropdown.scss';


const propTypes = {
  items: PropTypes.array.isRequired
}

const Dropdown = ({items}) => {
  const handleDropdownClick = () => {
    //здесь функция которая хэндлит клик по оции в дропдауне?
  };

  return (
    <div className="dropdown">
      {items.map((text, i) => (
        <a className="dropdown__link" key={i}>{text}</a>
      ))}
    </div>
  )
}

Dropdown.propTypes = propTypes;

export default Dropdown;