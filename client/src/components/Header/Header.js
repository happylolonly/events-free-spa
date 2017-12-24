import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './Header.css';


const propTypes = {

}

const Header = () => {
  return (
    <div className="header">
      <span>Events Free</span>
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
