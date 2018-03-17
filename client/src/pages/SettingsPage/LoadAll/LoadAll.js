import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import { API } from 'constants/config';


import './LoadAll.scss';


const propTypes = {
    // sources
    // loadAllEvents

};

class LoadAll extends Component {
  constructor() {
    super();

    this.state = {
        count: null
    };

    this.loadCount = this.loadCount.bind(this);
    
  }

  componentDidMount() {
      this.loadCount();
  }

  componentWillReceiveProps(nextProps) {

    // 
    
    if (nextProps.sources !== this.props.sources) {
        // this.loadCount(nextProps.sources);
        setTimeout(this.loadCount, 10);

    }
  }

  async loadCount() {
      try {
          // const events = JSON.parse(localStorage.getItem('events') || null) || {};
    const events = this.props.sources;
    var keys = Object.keys(events);

    var filtered = keys.filter(function(key) {
        return events[key]
    });

    let sources = filtered.join(',');

          const data = await axios.get(`${API}/events-count`, {
              params: {
                  sources,
                  day: 'today',
              }
          });
        //   debugger;
          this.setState({ count: data.data.totalCount });

      } catch (error) {
          console.log(error);
      }
  }

  handleClick = () => {
      this.props.loadAllEvents();
  }

  render() {
    return (
      <div className="load-all">
        <button onClick={this.handleClick}>Загрузить на весь день</button>
        {this.state.count ? <p className="events-count">{this.state.count} мероприятий ≈ {(this.state.count * 1.3).toFixed(2)} кб</p> : <p className="events-count">Мероприятий нет</p>}
        <p>(можно просматривать без интернета)</p>
      </div>
    )
  }
}

LoadAll.propTypes = propTypes;

export default LoadAll;