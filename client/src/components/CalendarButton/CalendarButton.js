import React from 'react';
import './CalendarButton.scss';
import Dropdown from './Dropdown/Dropdown';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import { domain } from '../../constants/config';

const propTypes = {
  id: PropTypes.number.isRequired,
};

class CalendarButton extends React.Component {
  state = {
    isDropdownOpen: false,
  };

  onClick = () => {
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
  };

  getProperUrl = item => {
    const event = this.props.event[this.props.id];
    const link = `\n${domain}/event/${event._id}`;
    const formattedDate = moment
      .utc(event.date)
      .format('YYYYMMDDTHHmmssZ')
      .replace('+00:00', 'Z');
    let calendarUrl = '';

    switch (item) {
      case 'Google Calendar':
        calendarUrl = 'https://calendar.google.com/calendar/render';
        calendarUrl += '?action=TEMPLATE';
        calendarUrl += '&dates=' + formattedDate;
        calendarUrl += '/' + formattedDate;
        calendarUrl += '&location=' + encodeURIComponent(event.location);
        calendarUrl += '&text=' + encodeURIComponent(event.title);
        calendarUrl += '&details=' + encodeURIComponent(event.title) + encodeURIComponent(link);
        break;
      default:
        calendarUrl = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'BEGIN:VEVENT',
          'URL:' + document.URL,
          'DTSTART:' + formattedDate,
          'DTEND:' + formattedDate,
          'SUMMARY:' + event.title,
          'DESCRIPTION:' + event.title,
          'LOCATION:' + event.location,
          'END:VEVENT',
          'END:VCALENDAR',
        ].join('\n');
        break;
    }

    return calendarUrl;
  };

  handleDropdownClick = (item, e) => {
    const url = this.getProperUrl(item);
    if (url.startsWith('data') || url.startsWith('BEGIN')) {
      let filename;
      if (item === 'iCalendar') {
        filename = 'download.ics';
      } else {
        filename = 'download.vcs';
      }
      const blob = new window.Blob([url], { type: 'text/calendar;charset=utf-8' });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(url, '_blank');
    }

    this.onClick();
  };

  render() {
    const items = ['Google Calendar', 'iCalendar'];
    return (
      <div className="calendar-button">
        <button className="calendar-btn" onClick={this.onClick}>
          <span>Добавить в календарь</span>
        </button>
        {this.state.isDropdownOpen && (
          <Dropdown items={items} handleDropdownClick={this.handleDropdownClick} />
        )}
      </div>
    );
  }
}

CalendarButton.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    event: state.event.data,
  };
}

export default connect(mapStateToProps)(CalendarButton);
