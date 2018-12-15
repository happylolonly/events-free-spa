import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';


import './Moderation.scss';


const propTypes = {
  id: PropTypes.string.isRequired,
  routerHistory: PropTypes.object.isRequired,
};

class Moderation extends Component {
  constructor() {
    super();

    this.state = {

    }
  }

  moderateEvent(id, moderate) {

    // add api
    axios.put(`/moderate?id=${id}&moderate=${moderate}`)
      .then(data => {
        this.props.routerHistory.push('/somepath');
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    return (
      <div className="">
        <button className="btn btn-success" onClick={() => this.moderateEvent(this.props.id, true)}>ok</button>
        <button className="btn btn-danger" onClick={() => this.moderateEvent(this.props.id, false)}>no</button>
      </div>
    )
  }
}

Moderation.propTypes = propTypes;

export default Moderation;
