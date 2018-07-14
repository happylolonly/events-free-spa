import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import WeekEvents from './WeekEvents';
import axios from 'axios';
import { API } from 'constants/config';


import './WeekEventsContainer';


const propTypes = {

};

class WeekEventsContainer extends Component {
  constructor() {
    super();

    this.state = {
        events: [],
        week: 'current',
        words: '',
    };

    this.handleSeachChange = this.handleSeachChange.bind(this);
    this.handleSearchButtonClick = this.handleSearchButtonClick.bind(this);
  }

  async loadEvents() {
      const { week, words } = this.state;

      try {
          const data = await axios.get(`${API}/week-events`, {
              params: {
                  query: {
                      week,
                      words,
                      sources: this.props.sources
                  }
              }
          });

          const events = data.data;
          this.setState({ events });
          
      } catch (error) {
          console.log(error);
      }
  }

  handleSeachChange(value, name) {
      this.setState({ [name]: value });
  }

  handleSearchButtonClick() {
      if (this.state.words) {
          this.loadEvents();
      }
  }

  render() {
    return (
      <div className="">
        <WeekEvents
            events={this.state.events}
            week={this.state.week}
            words={this.state.words}
            handleSeachChange={this.handleSeachChange}
            handleSearchButtonClick={this.handleSearchButtonClick}
        />
      </div>
    )
  }
}

WeekEventsContainer.propTypes = propTypes;

const mapStateToProps = ({ sources }) => {
  return {
    sources
  }
}

export default connect(mapStateToProps, {})(WeekEventsContainer);
