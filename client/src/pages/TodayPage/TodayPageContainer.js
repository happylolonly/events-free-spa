import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import io from 'socket.io-client';

import Search from './Search/Search';
import Filters from './Filters/Filters';
import TodayPage from './TodayPage';
import { Loader, Calendar } from 'components/common';
import ScrollUpButton from 'components/ScrollUpButton/ScrollUpButton';

import { loadEvents, resetEvents, loadEvent } from 'actions/events';

import './TodayPageContainer.scss';

const OFFSET_LENGTH = 10;

class TodayPageContainer extends PureComponent {
  static propTypes = {
    eventInfo: PropTypes.shape({
      data: PropTypes.object,
    }),
    filterBy: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    loadEvent: PropTypes.func.isRequired,
    loadEvents: PropTypes.func.isRequired,
    resetEvents: PropTypes.func.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
    amountOfLoadedEvents: PropTypes.number.isRequired,
    totalEventsAmount: PropTypes.number.isRequired,
  };

  static defaultProps = {
    filterBy: null,
  }

  constructor(props) {
    super(props);

    const {
      filterBy,
      location,
      amountOfLoadedEvents,
    } = props;

    const params = location.search && location.search.split('=')[1];

    let currentFilter = 'today';
    let formattedCalendarDate = null;

    if (params) {
      if (params.split('_').length === 3) {
        currentFilter = 'certain';
        formattedCalendarDate = params;
      } else {
        currentFilter = params;
      }
    }

    this.state = {
      search: '',
      offset: 0,
      currentFilter,
      isShowCalendar: false,
      formattedCalendarDate,

      preload: [],
    };

    if (currentFilter !== filterBy) {
      this.props.resetEvents();
      this.loadEvents();
    } else {
      this.state.offset = amountOfLoadedEvents - OFFSET_LENGTH;
    }
  }

  componentDidMount() {
    this.socket = io();
    this.socket.on('connect', () => console.log('connect'));
    this.socket.on('disconnect', () => console.log('disconnect'));
    this.socket.on('events-updated', this.eventsUpdated);
  }

  componentWillUnmount() {
    this.socket.close();
  }

  eventsUpdated = () => {
    console.log('events updated');
    this.loadEvents();
  };

  handleSecretButtonClick = () => {
    console.log('reparse request');
    this.socket.emit('reparse events');
  };

  handleSearch = search => {
    this.props.resetEvents();
    this.setState(
      {
        search,
        offset: 0,
      },
      () => {
        this.loadEvents();
      }
    );
  };

  loadEvents = () => {
    const { search, offset, currentFilter } = this.state;

    this.props.loadEvents({
      search,
      offset,
      day: currentFilter === 'certain' ? this.state.formattedCalendarDate : currentFilter,
    });
  };

  loadMore = () => {
    this.setState({ offset: this.state.offset + OFFSET_LENGTH }, () => {
      this.loadEvents();
    });
  };

  handleFilter = filter => {
    this.props.resetEvents();
    this.setState(
      {
        currentFilter: filter,
        isShowCalendar: filter === 'certain',
        offset: 0,
      },
      () => {
        if (filter === 'certain') {
          window.history.pushState(filter, null, `events?day=`);
        } else {
          window.history.pushState(filter, null, `events?day=${filter}`);
          this.loadEvents();
        }
      }
    );
  };

  toggleCalendar = () => {
    this.setState({ isShowCalendar: !this.state.isShowCalendar });
  };

  handleCalendarChange = date => {
    this.props.resetEvents();
    const formattedDate = moment(date).format('DD_MM_YYYY');
    this.setState(
      {
        calendarDate: date,
        isShowCalendar: false,
        offset: 0,
        formattedCalendarDate: formattedDate,
      },
      () => {
        window.history.pushState(formattedDate, null, `events?day=${formattedDate}`);
        this.loadEvents();
      }
    );
  };

  handleMouseOver = id => {
    if (this.state.preload.includes(id) || this.props.eventInfo.data[id]) {
      return;
    }

    const state = [...this.state.preload];
    state.push(id);

    this.setState({ preload: state }, () => {
      this.props.loadEvent(id);
    });
  };

  render() {
    const {
      props: {
        isLoading,
        totalEventsAmount,
        amountOfLoadedEvents,
        location: { search },
      },
      state: { currentFilter, isShowCalendar, calendarDate },
    } = this;

    return (
      <div className="today-page-container">
        {search === '?test' && (
          <button className="test-button" onClick={this.handleSecretButtonClick}>
            секретная кнопка
          </button>
        )}
        <Search handleSearch={this.handleSearch} search={this.state.search} />
        <Filters handleFilter={this.handleFilter} currentFilter={this.state.currentFilter} />
        <p className="event-sources">
          Откуда получать мероприятия можно выбрать <Link to="/settings">тут</Link>
        </p>

        <div className="calendar-wrapper">
          {currentFilter === 'certain' && (
            <button className="btn--link" onClick={this.toggleCalendar}>
              {!isShowCalendar ? 'Показать' : 'Cкрыть'} календарь
            </button>
          )}
          {isShowCalendar && <Calendar value={calendarDate} onChange={this.handleCalendarChange} />}
        </div>

        {isLoading && !amountOfLoadedEvents ? (
          <Loader />
        ) : (
          <TodayPage
            loadEvents={this.loadMore}
            currentFilter={currentFilter}
            handleMouseOver={this.handleMouseOver}
          />
        )}

        {totalEventsAmount === 0 && (
          <div className="no-results">
            <p>Ничего не найдено:(</p>
            <p>
              Попробуй изменить источники мероприятий в <Link to="/settings">настройках</Link>
            </p>
          </div>
        )}
        <ScrollUpButton />
      </div>
    );
  }
}

const mapStateToProps = ({ events, event }) => {
  return {
    eventInfo: event,
    filterBy: events.data.day,
    isLoading: events.isLoading,
    totalEventsAmount: events.data.totalCount,
    amountOfLoadedEvents: events.data.model.length,
  };
};

export default {
  component: connect(
    mapStateToProps,
    { loadEvents, resetEvents, loadEvent }
  )(TodayPageContainer),
  loadData: ({ dispatch }) => dispatch(loadEvents()),
};
