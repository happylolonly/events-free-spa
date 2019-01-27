import React from 'react';
import { Link } from 'react-router-dom';
import Santa from './Santa/Santa';
import { isChristmasHolidays } from 'utils/helpers';

import './Header.scss';

const Header = () => {
  return (
    <div className="header">
      <div className="title">
        <span className="title__main">Events Free {isChristmasHolidays() && <Santa />}</span>
        <span className="title__sub">Все бесплатные мероприятия в одном месте</span>
      </div>
      <nav className="nav">
        <ul className="nav__list">
          <li className="nav__item">
            <Link to="/events">Мероприятия</Link>
          </li>
          {/* <li className="nav__item"><Link to='/weekevents'>На неделю</Link></li> */}
          <li className="nav__item">
            <Link to="/about">О приложении</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
