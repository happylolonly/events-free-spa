import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './ScrollUpButton.scss';

const propTypes = {

}

class ScrollUpButton extends Component {

  state = {
    interval: 0,
    showButton: false
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (e) => {
    window.pageYOffset > 300 ? this.setState({ showButton: true }) : this.setState({ showButton: false })
  }

  scrollStep = () => {
    if (window.pageYOffset === 0) {
      clearInterval(this.state.interval);
    }
    window.scroll(0, window.pageYOffset - 50);
  }

  scrollToTop() {
    let interval = setInterval(this.scrollStep, 15);
    this.setState({ interval: interval });
  }

  render() {
    const { showButton } = this.state;
    if (showButton) {
      return (
        <button className="scroll-up-button" onClick={() => { this.scrollToTop() }}>
          Вверх
        </button>
      )
    }
    return null;
  }
}

ScrollUpButton.propTypes = propTypes;

export default ScrollUpButton;
