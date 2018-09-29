import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import EventDetail from './EventDetail';
import { Loader } from 'components/common';
import { withRouter } from 'react-router-dom';
import { Helmet } from "react-helmet";

import { loadEvent } from 'actions/events';

import { isEqual } from 'lodash';

import './EventPageContainer.scss';


const propTypes = {
  event: PropTypes.object.isRequired,
  loadEvent: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

class EventPageContainer extends Component {
  componentDidMount() {
    this.props.loadEvent(this.props.match.params.id);
    window.scrollTo(0, 0);
  }

  componentWillReceiveProps(nextProps) {
    const eventId = this.props.match.params.id;
    if (isEqual(nextProps.event.data[eventId], this.props.event.data[eventId])) return;

    window.scrollTo(0, 0);
  }

  render() {
    if (!Object.keys(this.props.event.data[this.props.match.params.id] || {}).length) {
      return <Loader />;
    }

    const { title, text, date, images, contacts, location, _id: id } = this.props.event.data[this.props.match.params.id];
    return (
      <div className="event-page-container">
        <Helmet>
          <title>{title}</title>
          <meta property="og:title" content={title}/>
          <meta property="og:url" content={`https://www.eventsfree.by/event/${id}`} />
          {images.length && <meta property="og:image" content={images[0]} />}
        </Helmet>
        <EventDetail
          id={id}
          title={title}
          text={text}
          date={date}
          images={images}
          contacts={contacts}
          location={location}
          routerHistory={this.props.history}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ event }) => {
  return {event}
}

EventPageContainer.propTypes = propTypes;

export default {
  component: connect(mapStateToProps, { loadEvent })(withRouter(EventPageContainer)),
  loadData: ({ dispatch }) => dispatch(loadEvent())
};
