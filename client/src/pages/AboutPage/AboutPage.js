import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router';

import SocialButtons from 'components/SocialButtons/SocialButtons';
import FeedbackForm from './FeedbackForm/FeedbackForm';

import './AboutPage.css';


const propTypes = {

}

const AboutPage = () => {
  return (
    <div className="about-page">
      <h3>О приложении</h3>
      <p>Все бесплатные мероприятия в одном месте)</p>
      <p>Мероприятия собираются автоматически, так что ты точно ничего не пропустишь.</p>
      <p>Откуда получать меприятия можно выбрать в <Link to="/settings">настройках</Link></p>
      <p>Дизайн пока не идеален, потом будет лучше)</p>
      <p>Серверу иногда нужно "проснуться", необходимо подождать 30 секунд.</p>
      <h5>Поделись с друзьями!</h5>
      <SocialButtons
        link="http://eventsfree.by"
        title="Все бесплатные мероприятия в одном месте!"
        isShowCount={true}
      />
      <FeedbackForm />
    </div>
  )
}

AboutPage.propTypes = propTypes;

export default AboutPage;
