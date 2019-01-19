import React from 'react';
import PropTypes from 'prop-types';
import './Contacts.scss';

const propTypes = {
  contacts: PropTypes.shape({
    phone: PropTypes.string,
    email: PropTypes.string,
    link: PropTypes.string,
  }).isRequired,
};

// check if this works
const defaultProps = {
  contacts: {
    phone: '',
    email: '',
    link: '',
  },
};

const Contacts = ({ contacts: { phone, email, link } }) => {
  return (
    <div className="contacts">
      <span className="contacts__title">Контакты:</span>
      <ul className="contacts__list">
        {link && (
          <li>
            Ссылка:{' '}
            <a href={`//${link}`} target="_blank" rel="noopener noreferrer">
              {link}
            </a>
          </li>
        )}
        {phone && (
          <li>
            Телефон: <a href={`tel:${phone}`}>{phone}</a>
          </li>
        )}
        {email && (
          <li>
            Email: <a href={`mailto:${email}`}>{email}</a>
          </li>
        )}
      </ul>
    </div>
  );
};

Contacts.propTypes = propTypes;
Contacts.defaultProps = defaultProps;

export default Contacts;
