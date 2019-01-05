import React, { Component } from 'react';

import './index.scss';

class ErrorBondary extends Component {
  state = {
    hasError: false,
  };

  componentDidCatch(error, info) {
    console.log(error, info);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      const { origin } = window.location;
      return (
        <div className="error-bondary">
          <p>Ой, ты что-то у нас сломал(а) :(</p>
          <a href={origin + '/about'}>Сообщи нам про эту ошибку, пожалуйста</a>
          <a href={origin + '/'}>Или вернись на главную</a>
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBondary;
