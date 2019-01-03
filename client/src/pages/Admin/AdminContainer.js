import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EventItem from 'components/EventItem/EventItem';

import axios from 'axios';
import { API } from 'constants/config';

// import './AdminContainer.scss';

const propTypes = {};

class AdminContainer extends Component {
  constructor() {
    super();

    this.state = {
      events: [],
    };
  }

  componentDidMount() {
    this.loadEvents();
  }

  // maybe will need to change
  async loadEvents() {
    try {
      const data = await axios.get(`${API}/events-for-tagging`);

      const events = data.data;
      this.setState({ events });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { events } = this.state;

    return (
      <div className="">
        {events.map(item => {
          const { date, title, _id, originalLink, source, tags } = item;
          return (
            <EventItem
              key={_id}
              date={date}
              title={title}
              link={_id}
              originalLink={originalLink}
              source={source}
              tags={tags}
              // mouseOver={() => handleMouseOver(id)}
              adminMode={true}
            />
          );
        })}
      </div>
    );
  }
}

AdminContainer.propTypes = propTypes;

export default AdminContainer;
