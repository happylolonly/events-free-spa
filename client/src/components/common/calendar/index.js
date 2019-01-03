import React from 'react';
import PropTypes from 'prop-types';
import ReactCalendar from 'react-calendar';

import './index.scss';

const propTypes = {
  // onChange
  // name
  // value
};

const Calendar = ({ onChange, value, name }) => {
  function handleChange(date) {
    onChange(date, name);
  }

  return (
    <div>
      <ReactCalendar onChange={handleChange} value={value} locale="ru-RU" />
    </div>
  );
};

Calendar.propTypes = propTypes;

export default Calendar;
