import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import SocialButtons from 'components/SocialButtons/SocialButtons';
import FeedbackForm from './FeedbackForm/FeedbackForm';

import './AboutPage.scss';


const propTypes = {

}

const AboutPage = () => {
  return (
    <div className="about-page">
      <h3>О приложении</h3>
      <p>Все бесплатные мероприятия в одном месте)</p>
      <p>Мероприятия собираются автоматически, так что ты точно ничего не пропустишь.</p>
      <p>Откуда получать мероприятия можно выбрать в <Link to="/settings">настройках</Link></p>
      <p>Знаешь JavaScript и хочешь помочь/поучиться?) Дай знать)</p>
      <h5>Поделись с друзьями!</h5>
      <SocialButtons
        link="https://www.eventsfree.by"
        title="Все бесплатные мероприятия в одном месте!"
        isShowCount={true}
      />
      <FeedbackForm />
    </div>
  )
}

AboutPage.propTypes = propTypes;

export default AboutPage;
