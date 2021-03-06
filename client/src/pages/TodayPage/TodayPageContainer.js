import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';

import io from 'socket.io-client';

import Search from './Search/Search';
import Filters from './Filters/Filters';
import Sources from './Sources/Sources';
import LoadAll from './LoadAll/LoadAll';
import TodayPage from './TodayPage';
import { Loader, Calendar } from 'components/common';
import ScrollUpButton from 'components/ScrollUpButton/ScrollUpButton';

import { loadEvents, resetEvents, loadEvent } from 'actions/events';

import './TodayPageContainer.scss';

const OFFSET_LENGTH = 10;

class TodayPageContainer extends PureComponent {
  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
    events: PropTypes.object.isRequired,
    sources: PropTypes.object.isRequired,
    loadEvents: PropTypes.func.isRequired,
    resetEvents: PropTypes.func.isRequired,
    loadEvent: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { resetEvents, location, events } = this.props;

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
      isSourcesOpen: false,
      formattedCalendarDate,

      preload: [],
    };

    if (currentFilter !== events.data.day) {
      resetEvents();
      this.loadEvents();
    } else {
      this.state.offset = events.data.model.length - OFFSET_LENGTH;
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.sources !== this.props.sources) {
      this.loadEvents();
    }
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
    const {
      state: { search, offset, currentFilter, formattedCalendarDate },
      props: { loadEvents },
    } = this;

    loadEvents({
      search,
      offset,
      day: currentFilter === 'certain' ? formattedCalendarDate : currentFilter,
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

  toggleSources = () => {
    this.setState({ isSourcesOpen: !this.state.isSourcesOpen });
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
    return (
      <div className="today-page-container">
        {this.props.location.search === '?test' && (
          <button className="test-button" onClick={this.handleSecretButtonClick}>
            секретная кнопка
          </button>
        )}
        <Search handleSearch={this.handleSearch} search={this.state.search} />
        <Filters handleFilter={this.handleFilter} currentFilter={this.state.currentFilter} />
        <p className="event-sources">
          <button className="btn--link" onClick={this.toggleSources}>
            {!this.state.isSourcesOpen ? 'Выбрать источники' : 'Cкрыть'}
          </button>
        </p>

        {this.state.isSourcesOpen && <Sources />}

        <div className="calendar-wrapper">
          {this.state.currentFilter === 'certain' && (
            <button className="btn--link" onClick={this.toggleCalendar}>
              {!this.state.isShowCalendar ? 'Показать' : 'Cкрыть'} календарь
            </button>
          )}
          {this.state.isShowCalendar && (
            <Calendar value={this.state.calendarDate} onChange={this.handleCalendarChange} />
          )}
        </div>

        {this.props.events.isLoading && !this.props.events.data.model.length ? (
          <Loader />
        ) : (
          <div>
            {this.state.currentFilter === 'today' && this.props.events.data.model.length && (
              <LoadAll />
            )}
            <TodayPage
              events={this.props.events.data.model}
              currentFilter={this.state.currentFilter}
              handleMouseOver={this.handleMouseOver}
            />

            {this.props.events.data.model.length < this.props.events.data.totalCount &&
              !this.props.events.isLoading && (
                <button className="show-more" onClick={this.loadMore}>
                  Показать еще
                </button>
              )}
          </div>
        )}

        {!this.props.events.data.totalCount && (
          <div className="no-results">
            <p>Ничего не найдено:(</p>
            <p>
              Попробуй{' '}
              <button className="btn--link" onClick={this.toggleSources}>
                изменить источники
              </button>{' '}
              откуда будут показываться мероприятия
            </p>
          </div>
        )}
        <ScrollUpButton />
      </div>
    );
  }
}

const mapStateToProps = ({ events, event, sources }) => {
  return { events, eventInfo: event, sources };
};

export default {
  component: connect(
    mapStateToProps,
    { loadEvents, resetEvents, loadEvent }
  )(TodayPageContainer),
  loadData: ({ dispatch }) => dispatch(loadEvents()),
};
