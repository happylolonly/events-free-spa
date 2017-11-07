import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TodayPage from './TodayPage';

import { Loader } from 'components/common';
import axios from 'axios';

import io from 'socket.io-client';
// import { API } from '../constants/config';

import Search from './Search/Search';

import './TodayPageContainer.css';

import toastr from 'toastr';


const propTypes = {

}

class TodayPageContainer extends Component {
  constructor() {
    super();

    this.state = {
      events: [],
      // filteredEvents: [],
      search: '',
      offset: 10,
      isLoading: false,
    }

    // this.loadEvent = this.loadEvent.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.loadMore = this.loadMore.bind(this);

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.eventsUpdated = this.eventsUpdated.bind(this);
    this.handleSecretButtonClick = this.handleSecretButtonClick.bind(this);
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

  componentWillReceiveProps(nextProps) {
    // nextProps.route.path === 'today'
    setTimeout(() => {
      // как обычно костыль потому что роутер не обновлялся
      // потом посмотрю
      this.loadEvents();
    }, 10);
    // this.loadEvents();
  }

  componentDidMount() {
    this.socket = io();
    this.socket.on('connect', this.connect);
    this.socket.on('disconnect', this.disconnect);
    this.socket.on('events-updated', this.eventsUpdated);

    this.loadEvents();
  }

  componentWillUnmount() {
    console.log('will un');
    // this.socket.disconnect();
    this.socket.close();
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


    axios.get(`/events?${this.props.route.path === 'today' ? 'today=true&' : ''}${this.props.route.path === 'past' ? 'past=true&' : ''}offset=${this.state.offset}&search=${this.state.search}&sources=${sources}`)
      .then(data => {
        console.log(data.data);

        this.setState({events: data.data, isLoading: false});
        // this.setState({filteredEvents: data.data});
      })
      .catch(error => {
        this.setState({isLoading: false});
        console.log(error);
      })
  }

  render() {
    console.log(this.props);
    return (
      <div className="today-page-container">
        {this.props.location.query.test && <button className="test-button" onClick={this.handleSecretButtonClick}>секретная кнопка</button>}
        <Search handleSearch={this.handleSearch} search={this.state.search} />

        {this.state.isLoading ? <Loader /> :
          <div>

            <TodayPage events={
              //   (() => {
              //   // по быстрому
              //   if (this.state.events.length === 0) return this.state.events;
              //   let items = this.state.events.filter(item => {
              //     let item2 = item.title.toLowerCase();
              //     return item2.indexOf(this.state.search.toLowerCase()) !=-1;
              //   })
              //
              //   // console.log(items);
              //   return items;
              //
              // })()
              this.state.events
            } />
            <button className="btn btn-link" onClick={this.loadMore}>Показать еще</button>

          </div>

    }


      </div>
    )
  }
}

TodayPageContainer.propTypes = propTypes;

export default TodayPageContainer;
