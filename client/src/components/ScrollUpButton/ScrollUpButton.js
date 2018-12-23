import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import './ScrollUpButton.scss';

const propTypes = {
  scrollStep: PropTypes.number.isRequired,
  delay: PropTypes.number.isRequired
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
    if (window.pageYOffset > 300) {
      this.setState({
        showButton: true,
      });
    } else {
      this.setState({
        showButton: false,
      });
    }
  }

  scrollStep() {
    if (window.pageYOffset === 0) {
      clearInterval(this.state.interval);
    }
    window.scroll(0, window.pageYOffset - this.props.scrollStep);
  }

  scrollToTop() {
    let interval = setInterval(this.scrollStep.bind(this), this.props.delay);
    this.setState({ interval: interval });
  }

  render() {
    const { showButton } = this.state;
    return (
      <Fragment>
        {
          showButton ?
            <button className="scroll-up-button" onClick={() => { this.scrollToTop() }}>
              Вверх
          </button> :
            null
        }
      </Fragment>
    );
  }
}

ScrollUpButton.propTypes = propTypes;

export default ScrollUpButton;
