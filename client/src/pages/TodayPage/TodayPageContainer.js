import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TodayPage from './TodayPage';

import { Link } from 'react-router';

import { Loader } from 'components/common';
import axios from 'axios';

import { API } from '../../constants/config';

import io from 'socket.io-client';
// import { API } from '../constants/config';

import Search from './Search/Search';
import Filters from './Filters/Filters';

import './TodayPageContainer.css';

import toastr from 'toastr';


const propTypes = {

}

class TodayPageContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      search: '',
      offset: 0,
      isLoading: false,
      totalCount: null,
      currentFilter: this.props.location.query.day || 'today',
    }

    // this.loadEvent = this.loadEvent.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.loadMore = this.loadMore.bind(this);

    this.handleFilter = this.handleFilter.bind(this);

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.eventsUpdated = this.eventsUpdated.bind(this);
    this.handleSecretButtonClick = this.handleSecretButtonClick.bind(this);
  }

  componentDidMount() {
    this.socket = io();
    this.socket.on('connect', this.connect);
    this.socket.on('disconnect', this.disconnect);
    this.socket.on('events-updated', this.eventsUpdated);

    this.loadEvents();
  }

  componentWillReceiveProps(nextProps) {
    // nextProps.route.path === 'today'
    setTimeout(() => {
      this.loadEvents();
    }, 10);
    // this.loadEvents();
  }

  componentWillUnmount() {
    this.socket.close();
  }

  connect() {
    console.log('connect');
  }

  disconnect() {
    console.log('disconnect');
  }

  eventsUpdated() {
    console.log('events updated');
    toastr.success('Мероприятия обновлены', 'Успешно!');
    this.loadEvents();
  }

  handleSecretButtonClick() {
    console.log('reparse request');
    this.socket.emit('reparse events');
  }

  handleSearch(search) {
    this.setState({search}, () => {
      this.loadEvents();
    })
  }

  loadMore() {
    this.setState({offset: this.state.offset + 10}, () => {
      this.loadEvents();
    })
  }

  loadEvents() {
    this.setState({isLoading: true});
    const events = JSON.parse(localStorage.getItem('events')) || {};
    var keys = Object.keys(events);

    var filtered = keys.filter(function(key) {
        return events[key]
    });

    let sources = filtered.join(',');


    axios.get(`${API}/events?day=${this.state.currentFilter}&offset=${this.state.offset}&search=${this.state.search}&sources=${sources}`)
      .then(data => {
        const { model, totalCount } = data.data;

        this.setState({
          events: [...this.state.events, ...model],
          totalCount: totalCount,
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({isLoading: false});
        console.log(error);
      })
  }

  handleFilter(filter) {
    this.setState({
      currentFilter: filter,
      events: [],
      totalCount: null,
      offset: 0,
    }, () => {
      window.history.pushState(filter, null, `events?day=${filter}`);
      this.loadEvents();
    });
  }

  render() {
    return (
      <div className="today-page-container">
        {this.props.location.query.test && <button className="test-button" onClick={this.handleSecretButtonClick}>секретная кнопка</button>}
        <Search handleSearch={this.handleSearch} search={this.state.search} />
        <Filters handleFilter={this.handleFilter} currentFilter={this.state.currentFilter} />

        {this.state.isLoading ? <Loader /> :
          <div>
            <TodayPage events={this.state.events} currentFilter={this.state.currentFilter} />

            {this.state.events.length < this.state.totalCount &&
              <button className="btn btn-link" onClick={this.loadMore}>Показать еще</button>}
          </div>
        }

        {this.state.totalCount === 0 &&
          <div>
            <p>Ничего не найдено:(</p>
            <p>Попробуй изменить откуда получать мероприятия в <Link to="/settings">настройках</Link></p>
          </div>
        }
      </div>
    )
  }
}

TodayPageContainer.propTypes = propTypes;

export default TodayPageContainer;
