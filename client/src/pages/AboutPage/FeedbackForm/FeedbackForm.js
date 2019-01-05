import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';

import './FeedbackForm.scss';

const propTypes = {};

class FeedbackForm extends Component {
  constructor() {
    super();

    this.state = {
      message: '',

      error: null,
    };

    this.handleChange = this.handleChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.sendFeedback = this.sendFeedback.bind(this);
  }

  handleChange(event) {
    const { value } = event.target;

    this.setState({ message: value, error: '' });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { message } = this.state;
    if (!message) {
      this.setState({ error: 'Не отправляй, пожалуйста, нам пустые сообщения' });
      return;
    }

    this.sendFeedback(message);
  }

  sendFeedback(message) {
    axios
      .post('/feedback', { date: Date.now(), message })
      .then(() => {
        // toastr.success('Мы получили твое сообщение!', 'Спасибо!');
        this.setState({ message: '' });
      })
      .catch(error => {
        console.log(error.response.data);
        this.setState({error: 'Ой, что-то пошло не так('});
      })
  }

  render() {
    return (
      <div className="feedback-form">
        <h5>Знаешь что можно сделать лучше? Напиши нам!</h5>
        <form>
          <div className="form-group">
            <label htmlFor="" />
            <textarea
              value={this.state.message}
              onChange={this.handleChange}
              className="form-control"
            />
          </div>

          {this.state.error && <div className="error">{this.state.error}</div>}

          <input type="submit" onClick={this.handleSubmit} value="Отправить" />
        </form>
      </div>
    );
  }
}

FeedbackForm.propTypes = propTypes;

export default FeedbackForm;
