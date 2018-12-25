import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './ScrollUpButton.scss';

const propTypes = {

}

class ScrollUpButton extends Component {

  state = {
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
    const scrollStep = 50;
    if (window.pageYOffset === 0) {
      clearInterval(this.interval);
    }
    window.scroll(0, window.pageYOffset - scrollStep);
  }

  scrollToTop() {
    const delay = 15;
    this.interval = setInterval(this.scrollStep, delay);
    // this.setState({ interval: interval });
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
