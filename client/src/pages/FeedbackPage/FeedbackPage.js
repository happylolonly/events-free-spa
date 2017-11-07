import React, { Component } from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import moment from 'moment';

import './FeedbackPage.css';


const propTypes = {

}

// playing with REST

class FeedbackPage extends Component {
  constructor() {
    super();

    this.state = {
      password: null,
      feedbacks: []
    }

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.deleteFeedback = this.deleteFeedback.bind(this);
  }

  handlePasswordChange(event) {
    const { value } = event.target;
    this.setState({ password: value}, () => {
      if (value === '1122') {
        this.getFeedbacks();
      }
    });
  }

  getFeedbacks() {
    axios.get('/feedback')
      .then((data) => {
        this.setState({feedbacks: data.data})
      })
      .catch(error => {
        console.dir(error);
      })
  }

  deleteFeedback(id) {
    axios.delete(`/feedback?id=${id}`)
      .then(() => {
        console.log('success');
        this.getFeedbacks();
      })
      .catch(error => {
        console.dir(error);
      })
  }

  render() {
    console.log(this.state);
    return (
      <div className="feedback-page">
        {this.state.password === '1122' ?
          <div>
            фидбеки

            {this.state.feedbacks.map(item => {
              const { _id:id, date, message } = item;
              return (
                <div key={id}>
                  <span>{moment(date).format('YYYY-MM-DD HH-MM')}</span>
                  <p>{message}</p>
                  <span className="delete" onClick={() => {this.deleteFeedback(id)}}>x</span>
                </div>
              )
            })}
        </div> :

        <input type="text" value={this.state.password} onChange={this.handlePasswordChange} />
      }

      </div>
    )
  }
}

FeedbackPage.propTypes = propTypes;

export default FeedbackPage;
