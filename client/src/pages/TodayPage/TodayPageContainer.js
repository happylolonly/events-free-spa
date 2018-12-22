import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import io from 'socket.io-client';

import Search from './Search/Search';
import Filters from './Filters/Filters';
import TodayPage from './TodayPage';
import { Loader, Calendar } from 'components/common';
import moment from 'moment';

import { loadEvents, resetEvents, loadEvent } from 'actions/events';

import './TodayPageContainer.scss';

const OFFSET_LENGTH = 10;

const propTypes = {
  events: PropTypes.object.isRequired,
  loadEvents: PropTypes.func.isRequired,
  resetEvents: PropTypes.func.isRequired,
}

class TodayPageContainer extends Component {
  constructor(props) {
    super(props);

    const params = this.props.location.search && this.props.location.search.split('=')[1];

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

      preload: []
    }

    if (currentFilter !== this.props.events.data.day) {
      this.props.resetEvents();
      this.loadEvents();
    } else {
      this.state.offset = this.props.events.data.model.length - OFFSET_LENGTH;
    }

    this.handleSearch = this.handleSearch.bind(this);
    this.loadMore = this.loadMore.bind(this);

    this.handleFilter = this.handleFilter.bind(this);

    this.eventsUpdated = this.eventsUpdated.bind(this);
    this.handleSecretButtonClick = this.handleSecretButtonClick.bind(this);
    this.toggleCalendar = this.toggleCalendar.bind(this);
    this.handleCalendarChange = this.handleCalendarChange.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
  }

  componentDidMount() {

    this.socket = io();
    this.socket.on('connect', () => console.log('connect'));
    this.socket.on('disconnect', () => console.log('disconnect'));
    this.socket.on('events-updated', this.eventsUpdated);
  }

  // componentWillReceiveProps(nextProps) {
  //   // nextProps.route.path === 'today'
  //   setTimeout(() => {
  //     this.loadEvents();
  //   }, 10);
  //   // this.loadEvents();
  // }

  componentWillUnmount() {
    this.socket.close();
  }

  eventsUpdated() {
    console.log('events updated');
    // toastr.success('Мероприятия обновлены', 'Успешно!');
    this.loadEvents();
  }

  handleSecretButtonClick() {
    console.log('reparse request');
    this.socket.emit('reparse events');
  }

  handleSearch(search) {
    this.props.resetEvents();
    this.setState({
      search,
      offset: 0,
    }, () => {
      this.loadEvents();
    })
  }

  loadEvents() {
    const { search, offset, currentFilter } = this.state;

    // debugger;

    this.props.loadEvents({
      search,
      offset,
      day: currentFilter === 'certain' ? this.state.formattedCalendarDate : currentFilter
    })
  }

  loadMore() {
    this.setState({ offset: this.state.offset + OFFSET_LENGTH }, () => {
      this.loadEvents();
    })
  }

  handleFilter(filter) {
    this.props.resetEvents();
    this.setState({
      currentFilter: filter,
      isShowCalendar: filter === 'certain',
      offset: 0,
    }, () => {
      if (filter === 'certain') {
        window.history.pushState(filter, null, `events?day=`);


      } else {
        window.history.pushState(filter, null, `events?day=${filter}`);
        this.loadEvents();
      }

    });
  }

  toggleCalendar() {
    this.setState({ isShowCalendar: !this.state.isShowCalendar });
  }

  handleCalendarChange(date) {
    this.props.resetEvents();
    const formattedDate = moment(date).format('DD_MM_YYYY');
    this.setState({ calendarDate: date, isShowCalendar: false, offset: 0, formattedCalendarDate: formattedDate }, () => {
      window.history.pushState(formattedDate, null, `events?day=${formattedDate}`);
      this.loadEvents();
    });
  }

  handleMouseOver(id) {
    if (this.state.preload.includes(id) || this.props.eventInfo.data[id]) {
      return;
    }

    const state = [...this.state.preload];
    state.push(id);

    this.setState({ preload: state }, () => {
      this.props.loadEvent(id);
    });
  }

  render() {
    return (
      <div className="today-page-container">
        {this.props.location.search === '?test' && <button className="test-button" onClick={this.handleSecretButtonClick}>секретная кнопка</button>}
        <Search handleSearch={this.handleSearch} search={this.state.search} />
        <Filters handleFilter={this.handleFilter} currentFilter={this.state.currentFilter} />
        <p className="event-sources">Откуда получать мероприятия можно выбрать <Link to="/settings">тут</Link></p>

        <div className="calendar-wrapper">

          {this.state.currentFilter === 'certain' && <button className="btn-toggle-calendar" onClick={this.toggleCalendar}>{!this.state.isShowCalendar ? 'Показать' : 'Cкрыть'} календарь</button>}
          {this.state.isShowCalendar && <Calendar value={this.state.calendarDate} onChange={this.handleCalendarChange} />}

        </div>



        {this.props.events.isLoading && !this.props.events.data.model.length ? <Loader /> :
          <div>
            <TodayPage events={this.props.events.data.model} currentFilter={this.state.currentFilter} handleMouseOver={this.handleMouseOver} />

            {this.props.events.data.model.length < this.props.events.data.totalCount && !this.props.events.isLoading &&
              <button className="show-more" onClick={this.loadMore}>Показать еще</button>}
          </div>
        }

        {this.props.events.data.totalCount === 0 &&
          <div className="no-results">
            <p>Ничего не найдено:(</p>
            <p>Попробуй изменить откуда получать мероприятия в <Link to="/settings">настройках</Link></p>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = ({ events, event }) => {
  return { events, eventInfo: event }
};

TodayPageContainer.propTypes = propTypes;

export default {
  component: connect(mapStateToProps, { loadEvents, resetEvents, loadEvent })(TodayPageContainer),
  loadData: ({ dispatch }) => dispatch(loadEvents())
};
