import React from 'react';
import { Link } from 'react-router-dom';
import Santa from './Santa/Santa';
import { isChristmasHolidays } from 'utils/helpers';

import './Header.scss';


const Header = () => {
  return (
    <div className="header">
      <div className="title">
        <span>Events Free {isChristmasHolidays() && <Santa />}</span>
        <p>Все бесплатные мероприятия в одном месте</p>
      </div>
      <ul>
        <li><Link to='/events'>Мероприятия</Link></li>
        <li><Link to='/weekevents'>На неделю</Link></li>
        <li><Link to='/about'>О приложении</Link></li>
        <li><Link to='/settings'>Настройки</Link></li>
      </ul>
    </div>
  )
}

export default Header;
