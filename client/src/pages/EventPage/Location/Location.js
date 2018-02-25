import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Map from './Map';

import './Location.scss';




const propTypes = {
//locaton
}

class Location extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowMap: false,
    }

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ isShowMap: !this.state.isShowMap });
  }

  render() {
    return (

      <div className="location">
      <h5>Место</h5>
      <p>{this.props.location}</p>
      <button  className="btn-link" onClick={this.handleClick}>{!this.state.isShowMap ? 'Показать на карте' : 'Скрыть'} </button>

      {this.state.isShowMap &&       <Map location={this.props.location} />
 }

    </div>

    )
  }
}

Location.propTypes = propTypes;

export default Location;
