import React from 'react';
import PropTypes from 'prop-types';
import './Dropdown.scss';


const propTypes = {
  items: PropTypes.array.isRequired,
  handleDropdownClick: PropTypes.func.isRequired
}

class Dropdown extends React.Component {
  onClick = (event, item) => {
    this.props.handleDropdownClick(item);
  }

  render() {
    const items = this.props.items;
    return (
      <div className="dropdown">
        {items.map((text, i) => (
          <button className="dropdown__link" key={i} onClick={this.onClick}>{text}</button>
        ))}
      </div>
    )
  }
}

Dropdown.propTypes = propTypes;

export default Dropdown;