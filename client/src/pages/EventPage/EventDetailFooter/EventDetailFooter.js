import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Map from '../Location/Map';
import Contacts from '../Contacts/Contacts';
import Location from '../Location/Location';
import SocialButtons from 'components/SocialButtons/SocialButtons';
import CalendarButton from 'components/CalendarButton/CalendarButton';

import isEmpty from 'lodash/isEmpty';

import './EventDetailFooter.scss';

class EventDetailFooter extends PureComponent {
  static propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    image: PropTypes.string,
    location: PropTypes.string,
    contacts: PropTypes.object,
  };

  static defaultProps = {
    image: '',
    location: '',
    contacts: {},
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
          {!isEmpty(contacts) && <Contacts contacts={contacts} />}
          {location && (
            <Location location={location} onClick={this.handleClick} isShowMap={isShowMap} />
          )}

          <CalendarButton id={id} />
        </div>
        {isShowMap && (
          <div className="event-detail-footer__map">
            <Map location={location} />
          </div>
        )}
        <div className="event-detail-footer__row">
          <SocialButtons
            link={`https://www.eventsfree.by/event/${id}`}
            title={title}
            isShowCount={false}
            image={image}
          />
        </div>
      </div>
    );
  }
}

export default EventDetailFooter;
