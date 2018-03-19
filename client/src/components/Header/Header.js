import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './Header.scss';


const propTypes = {

}

const Header = () => {
  return (
    <div className="header">
      <div className="title">
        <span>Events Free</span>
        <p>Все бесплатные мероприятия в одном месте</p>
      </div>
      <ul>
        <li><Link to='/events'>Мероприятия</Link></li>
        <li><Link to='/about'>О приложении</Link></li>
        <li><Link to='/settings'>Настройки</Link></li>
      </ul>
    </div>
  )
}

Header.propTypes = propTypes;

export default Header;
