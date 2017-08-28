import React, { Component, PropTypes } from 'react';

import { Loader } from '../common';

import axios from 'axios';

import Moderate from './Moderate';

import './ModerateContainer.css';


const propTypes = {

}

class ModerateContainer extends Component {
  constructor() {
    super();

    this.state = {
      events: [],
      totalCount: null,
    }

    this.moderateEvent = this.moderateEvent.bind(this);
  }

  componentDidMount() {
    this.loadModerateEvents();
  }

  loadModerateEvents() {
    // ?? байнд
    axios.get(`/moderate`)
      .then(data => {
        // const { events, totalCount } = data.data;
        this.setState({
          events: data.data,
          // totalCount: totalCount,
        })
      })
      .catch(error => {
        console.log(error);
      })
  }

  moderateEvent(id, moderate) {
    axios.put(`/moderate?id=${id}&moderate=${moderate}`)
      .then(data => {
        // const { events, totalCount } = data.data;
        this.loadModerateEvents();
        // this.setState({
        //   events: data.data,
        //   // totalCount: totalCount,
        // })
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    console.log(this.state.events);
    return (
      <div className="">
        {this.state.events.length === 0 ? <Loader /> :
          <Moderate
            events={this.state.events}
            moderateEvent={this.moderateEvent}
          />}
      </div>
    )
  }
}

ModerateContainer.propTypes = propTypes;

export default ModerateContainer;
