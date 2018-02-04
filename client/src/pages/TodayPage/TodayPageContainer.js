import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import io from 'socket.io-client';

import Search from './Search/Search';
import Filters from './Filters/Filters';
import TodayPage from './TodayPage';
import { Loader } from 'components/common';

import { loadEvents, resetEvents } from 'actions/events';

import './TodayPageContainer.scss';


const propTypes = {
  events: PropTypes.object.isRequired,
  loadEvents: PropTypes.func.isRequired,
  resetEvents: PropTypes.func.isRequired,
}

class TodayPageContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      offset: 0,
      // currentFilter: this.props.location.query.day || 'today',
      currentFilter: 'today',
    }

    this.props.resetEvents();

    this.handleSearch = this.handleSearch.bind(this);
    this.loadMore = this.loadMore.bind(this);

    this.handleFilter = this.handleFilter.bind(this);

    this.eventsUpdated = this.eventsUpdated.bind(this);
    this.handleSecretButtonClick = this.handleSecretButtonClick.bind(this);
  }

  componentDidMount() {
    this.loadEvents();

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

    this.props.loadEvents({
      search,
      offset,
      day: currentFilter
    })
  }

  loadMore() {
    this.setState({offset: this.state.offset + 10}, () => {
      this.loadEvents();
    })
  }

  handleFilter(filter) {
    this.props.resetEvents();
    this.setState({
      currentFilter: filter,
      offset: 0,
    }, () => {
      window.history.pushState(filter, null, `events?day=${filter}`);
      this.loadEvents();
    });
  }

  render() {
    return (
      <div className="today-page-container">
        {this.props.location.query && false && <button className="test-button" onClick={this.handleSecretButtonClick}>секретная кнопка</button>}
        <Search handleSearch={this.handleSearch} search={this.state.search} />
        <Filters handleFilter={this.handleFilter} currentFilter={this.state.currentFilter} />

        {this.props.events.isLoading ? <Loader /> :
          <div>
            <TodayPage events={this.props.events.data.model} currentFilter={this.state.currentFilter} />

            {this.props.events.data.model.length < this.props.events.data.totalCount &&
              <button className="btn btn-link show-more" onClick={this.loadMore}>Показать еще</button>}
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

const mapStateToProps = ({ events }) => {
  return {events}
};

TodayPageContainer.propTypes = propTypes;

export default {
  component: connect(mapStateToProps, { loadEvents, resetEvents })(TodayPageContainer),
  loadData: ({ dispatch }) => dispatch(loadEvents())
};
