import React, { Component } from 'react';
import './CalendarButton.scss';
import Dropdown from './Dropdown/Dropdown';

class CalendarButton extends Component {
  constructor() {
    super();

    this.state = {
      isDropdownOpen: false
    }

    this.onClick = this.onClick.bind(this);

  }

  onClick(event) {
    this.setState({isDropdownOpen: !this.state.isDropdownOpen});
  }

  render() {
    const items = ['Google Calendar', 'iCalendar', 'vCalendar']
    return (
      <div className="calendar">
        <button className="calendar-button" onClick={this.onClick}>
          <span>Добавить в календарь</span>
        </button>
        {this.state.isDropdownOpen && 
          <Dropdown items={items}></Dropdown>
        }
      </div>
    );      
  }
}

export default CalendarButton;
