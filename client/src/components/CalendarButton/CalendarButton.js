import React from 'react';
import './CalendarButton.scss';
import Dropdown from './Dropdown/Dropdown';

class CalendarButton extends React.Component {
  state = {
    isDropdownOpen: false
  }

  onClick = (event) => {
    this.setState({isDropdownOpen: !this.state.isDropdownOpen});
  }

  handleDropdownClick = (item) => {
    console.log(item);
    //здесь функция которая хэндлит клик по оции в дропдауне?
  };

  render() {
    const items = ['Google Calendar', 'iCalendar', 'vCalendar']
    return (
      <div className="calendar-button">
        <button className="calendar-btn" onClick={this.onClick}>
          <span>Добавить в календарь</span>
        </button>
        {this.state.isDropdownOpen && 
          <Dropdown items={items} handleDropdownClick={this.handleDropdownClick}></Dropdown>
        }
      </div>
    );      
  }
}

export default CalendarButton;
