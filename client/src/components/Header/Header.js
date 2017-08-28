import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import './Header.css';


const propTypes = {

}

const Header = () => {
  return (
    <div className="header">
      <ul>
        <li><Link to='/today'>На сегодня</Link></li>
        <li><Link to='/all'>Все</Link></li>
        <li><Link to='/past'>Прошедшие</Link></li>
      </ul>
      <span>Events Free</span>
      <ul>
        <li><Link to='/about'>О приложении</Link></li>
        <li><Link to='/settings'>Настройки</Link></li>
      </ul>
    </div>
  )
}

Header.propTypes = propTypes;

export default Header;
