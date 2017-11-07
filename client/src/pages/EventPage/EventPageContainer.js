import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EventDetail from './EventDetail';
import { Loader } from '../common';

import axios from 'axios';
// import { API } from '';

import './EventPageContainer.css';


const propTypes = {

}

// const fakeEvent = {
//   title: 'Cool event',
//   text: '  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet veritatis ut repellat officiis ipsam aut, totam ratione optio laboriosam deserunt. Ullam consequuntur pariatur facere blanditiis, facilis minus ab? Hic omnis mollitia consequatur dolores voluptatum, labore assumenda quas possimus officiis veritatis quod ab nulla, porro, optio neque fugit cumque id vel?',
//   date: 38293893483,
//   images: [
//     {
//       src: 'http://www.uniwallpaper.com/static/images/Sunset-Village-Wallpaper_8I7ogbf.jpg',
//       description: 'top image'
//     },
//     {
//       src: 'http://www.uniwallpaper.com/static/images/EPUlp9X_YqNR99f.jpg',
//       description: 'top image second'
//     }
//   ]
// }


class EventPageContainer extends Component {
  constructor() {
    super();

    this.state = {
      event: {},
    }

    this.loadEvent = this.loadEvent.bind(this);
  }

  componentDidMount() {
    this.loadEvent(this.props.params.id);
    window.scrollTo(0, 0);
    console.log(this.props);
  }

  componentWillUnmount() {
    document.title = 'Events free';
  }

  loadEvent(id) {
    axios.get(`/event?id=${id}`)
      .then(data => {
        // setTimeout(() => {
        const eventData = data.data[0];
          this.setState({event:eventData });
          window.scrollTo(0, 0);
          document.title = eventData.title;
        // });
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    const { title, text, date, images } = this.state.event;
    return (
      <div className="event-page-container">
        {Object.keys(this.state.event).length === 0  ?
          <Loader /> :
          <EventDetail
            title={title}
            text={text}
            date={date}
            images={images}
          />
    }
      </div>
    )
  }
}

EventPageContainer.propTypes = propTypes;

export default EventPageContainer;
