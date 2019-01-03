import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import WeekEvents from './WeekEvents';

import axios from 'axios';
import { API } from 'constants/config';

import './WeekEventsContainer';

const STORAGE_KEY = 'week-events-search';

const propTypes = {
  sources: PropTypes.object.isRequired,
};

class WeekEventsContainer extends Component {
  constructor() {
    super();

    this.state = {
      events: [],
      data: {
        week: 'current',
        words: '',
      },
      dataErrors: {
        week: '',
        words: '',
      },
    };

    this.handleSeachChange = this.handleSeachChange.bind(this);
    this.handleSearchButtonClick = this.handleSearchButtonClick.bind(this);
  }

  componentDidMount() {
    const search = localStorage.getItem(STORAGE_KEY) || '""';
    const { week, words } = JSON.parse(search) || {};

    if (words) {
      this.setState(
        {
          data: {
            week,
            words,
          },
        },
        () => {
          this.loadEvents();
        }
      );
    }
  }

  async loadEvents() {
    const { week, words } = this.state.data;
    let start, end;

    if (week === 'current') {
      start = moment()
        .startOf('isoWeek')
        .valueOf();
      end = moment()
        .endOf('isoWeek')
        .valueOf();
    } else if (week === 'next') {
      start = moment()
        .add(1, 'weeks')
        .startOf('isoWeek')
        .valueOf();
      end = moment()
        .add(1, 'weeks')
        .endOf('isoWeek')
        .valueOf();
    }

    try {
      const data = await axios.get(`${API}/week-events`, {
        params: {
          words,
          start,
          end,
          sources: Object.keys(this.props.sources)
            .filter(item => this.props.sources[item])
            .join(','),
        },
      });

      const events = data.data;
      this.setState({ events });
    } catch (error) {
      console.log(error);
    }
  }

  handleSeachChange(value, name) {
    this.setState({
      data: {
        ...this.state.data,
        [name]: value,
      },
      dataErrors: {
        ...this.state.dataErrors,
        [name]: '',
      },
    });
  }

  handleSearchButtonClick() {
    if (this.validate()) {
      this.loadEvents();

      const { week, words } = this.state.data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ week, words }));
    }
  }

  validate() {
    const errors = {};
    const { week, words } = this.state.data;

    if (!week) {
      errors.week = 'Выбери неделю';
    }

    if (!words) {
      errors.words = 'Заполни интересующие тебя слова';
    }

    if (!Object.keys(errors).length) {
      return true;
    } else {
      this.setState({ dataErrors: errors });
      return false;
    }
  }

  render() {
    return (
      <div className="">
        <WeekEvents
          events={this.state.events}
          week={this.state.data.week}
          words={this.state.data.words}
          handleSeachChange={this.handleSeachChange}
          handleSearchButtonClick={this.handleSearchButtonClick}
          weekError={this.state.dataErrors.week}
          wordsError={this.state.dataErrors.words}
        />
      </div>
    );
  }
}

WeekEventsContainer.propTypes = propTypes;

const mapStateToProps = ({ sources }) => {
  return {
    sources,
  };
};

export default connect(mapStateToProps)(WeekEventsContainer);
