import React from 'react';
import PropTypes from 'prop-types';

import SocialButtons from 'components/SocialButtons/SocialButtons';

import './Footer.scss';


const propTypes = {

}

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

      <p>© 2017 - {new Date().getFullYear()} Events Free. All rights reserved. Making with love <span>❤</span></p>
    </footer>
  )
}

Footer.propTypes = propTypes;

export default Footer;
