import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Map from '../Location/Map';
import SocialButtons from 'components/SocialButtons/SocialButtons';
import CalendarButton from 'components/CalendarButton/CalendarButton';

import './EventDetailFooter.scss';

class EventDetailFooter extends PureComponent {
  static propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    location: PropTypes.string,
    contacts: PropTypes.string,
    id: PropTypes.number.isRequired,
  };

  static defaultProps = {
    id: '',
    title: '',
    image: '',
    location: '',
    contacts: '',
  };

  state = {
    isShowMap: false,
  };

  handleClick = () => {
    this.setState({ isShowMap: !this.state.isShowMap });
  };

  render() {
    const {
      props: { title, location, id, contacts, image },
      state: { isShowMap },
    } = this;

    return (
      <div className="event-detail-footer">
        <div className="event-detail-footer__row">
          <SocialButtons
            link={`https://www.eventsfree.by/event/${id}`}
            title={title}
            isShowCount={false}
            image={image}
          />
          <CalendarButton id={id} />
        </div>

        <div className="event-detail-footer__row">
          {contacts && <p>Контакты: {contacts}</p>}
          {location && <p>Место: {location}</p>}
        </div>
        <div className="event-detail-footer__map">
          <button className="btn--link" onClick={this.handleClick}>
            {!isShowMap ? 'Показать на карте' : 'Скрыть'}{' '}
          </button>
          {isShowMap && <Map location={location} />}
        </div>
      </div>
    );
  }
}

export default EventDetailFooter;
