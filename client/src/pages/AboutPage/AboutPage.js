import React from 'react';

import SocialButtons from 'components/SocialButtons/SocialButtons';
import FeedbackForm from './FeedbackForm/FeedbackForm';

import './AboutPage.scss';

const propTypes = {};

const AboutPage = () => {
  return (
    <div className="about-page">
      <h3>О приложении</h3>
      <p>
        Приложение собирает бесплатные мероприятия с различных источников и показывает все в одном
        месте
      </p>
      <p>Мероприятия собираются автоматически, так что ты точно ничего не пропустишь.</p>
      <hr />
      <p>Знаешь JavaScript и хочешь помочь/поучиться?) Дай знать)</p>
      <p>
        Открытый код{' '}
        <a href="https://github.com/happylolonly/events-free-spa" target="_blank">
          https://github.com/happylolonly/events-free-spa
        </a>
      </p>
      <hr />
      <h5>Поделись с друзьями!</h5>
      <SocialButtons
        link="https://www.eventsfree.by"
        title="Все бесплатные мероприятия в одном месте!"
        isShowCount
      />
      <FeedbackForm />
    </div>
  );
};

AboutPage.propTypes = propTypes;

export default AboutPage;
