import React from 'react';

import SocialButtons from 'components/SocialButtons/SocialButtons';
import ChristmasTree from './ChristmasTree/ChristmasTree';

import { isChristmasHolidays } from 'utils/helpers';

import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer" id="js-footer">
      <div>
        <SocialButtons
          link="https://www.eventsfree.by"
          title="Все бесплатные мероприятия в одном месте!"
          isShowCount={false}
        />

        <ul className='footer__contact'>
          <li>Email: <a href='mailto:hello@eventsfree.by'>hello@eventsfree.by</a></li>
          <li>Позвони нам: <a href='tel:+375-29-11-999-40'>+375-29-11-999-40</a></li>
        </ul>
      </div>

      <p>
        © 2017 - {new Date().getFullYear()} Events Free. Making with love{' '}
        {isChristmasHolidays() ? <ChristmasTree /> : <span>❤</span>}
      </p>
    </footer>
  );
};

export default Footer;
