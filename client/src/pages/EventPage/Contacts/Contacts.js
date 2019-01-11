import React from 'react';
import PropTypes from 'prop-types';

import './Contacts.scss';

const Contacts = ({ contacts }) => {
  return contacts ? (
    <div className="contacts">
      <span className="contacts__title">Контакты:</span>
      <ul>
        {Object.keys(contacts).map(item => {
          return <li key={item}>{`${contacts[item]}`}</li>;
        })}
      </ul>
    </div>
  ) : null;
};

Contacts.propTypes = {
  contacts: PropTypes.object.isRequired,
};

export default Contacts;
