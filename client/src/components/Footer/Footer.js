import React from 'react';

import SocialButtons from 'components/SocialButtons/SocialButtons';
import ChristmasTree from './ChristmasTree/ChristmasTree';

import { isChristmasHolidays } from 'utils/helpers';

import './Footer.scss';


const Footer = () => {
  return (
    <footer className="footer">
      <div>
        <SocialButtons
          link="https://www.eventsfree.by"
          title="Все бесплатные мероприятия в одном месте!"
          isShowCount={false}
        />

        <ul>
          <li>Email: hello@eventsfree.by</li>
          <li>Позвони нам: +375-29-11-999-40</li>
        </ul>
      </div>

      <p>© 2017 - {new Date().getFullYear()} Events Free. Making with love {isChristmasHolidays() ? <ChristmasTree /> : <span>❤</span>}</p>
    </footer>
  )
}

export default Footer;
