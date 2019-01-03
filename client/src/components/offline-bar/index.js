import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classnames from 'classnames';
import './index.scss';

const propTypes = {};

class OflineBar extends Component {
  constructor() {
    super();

    this.state = {
      status: navigator.onLine,
      isShow: false,
    };

    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.updateOnlineStatus = this.updateOnlineStatus.bind(this);
  }

  componentDidMount() {
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
  }

  updateOnlineStatus() {
    this.setState({
      status: navigator.onLine,
      isShow: true,
    });

    if (navigator.onLine) {
      setTimeout(() => {
        this.setState({ isShow: false });
      }, 3000);
    }
  }

  handleButtonClick() {
    this.setState({ isShow: false });
  }

  render() {
    if (!this.state.isShow) {
      return null;
    }

    const classNames = classnames('offline-bar', this.state.status ? 'online' : 'offline');
    return (
      <div className={classNames}>
        <p>{!this.state.status ? 'Нет интернет соединения' : 'Соединение появилось!'}</p>
        <button onClick={this.handleButtonClick}>Скрыть</button>
      </div>
    );
  }
}

OflineBar.propTypes = propTypes;

export default OflineBar;
