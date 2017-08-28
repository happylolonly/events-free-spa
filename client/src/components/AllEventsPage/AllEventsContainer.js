import React, { Component, PropTypes } from 'react';

import TodayPage from './TodayPage';

import axios from 'axios';
// import { API } from '../constants/config';

import Search from './Search/Search';

import './AllEventsContainer.scss';


const propTypes = {

}

class AllEventsContainer extends Component {
  constructor() {
    super();

    this.state = {
      events: [],
      filteredEvents: [],
      search: ''
    }

    // this.loadEvent = this.loadEvent.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.loadEvents();
  }

  handleSearch(search) {
    this.setState({search})
  }

  loadEvents() {
    axios.get(`/events?today=true`)
      .then(data => {
        console.log(data.data);
        this.setState({events: data.data});
        this.setState({filteredEvents: data.data});
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    console.log(this.state);
    return (
      <div className="all-events-container">
        <Search handleSearch={this.handleSearch} search={this.state.search} />
        <TodayPage events={(() => {
            // по быстрому
            if (this.state.events.length === 0) return this.state.events;
            let items = this.state.events.filter(item => {
              let item2 = item.title.toLowerCase();
              return item2.indexOf(this.state.search.toLowerCase()) !=-1;
            })

            // console.log(items);
            return items;

          })()} />

      </div>
    )
  }
}

AllEventsContainer.propTypes = propTypes;

export default AllEventsContainer;
