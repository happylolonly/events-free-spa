import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './Location.scss';

const propTypes = {
  //locaton
};

class Location extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="location">
        <h5>Место</h5>
        <p>{this.props.location}</p>
      </div>
    );
  }
}

Location.propTypes = propTypes;

export default Location;
