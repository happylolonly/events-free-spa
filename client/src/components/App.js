import React, { Component } from 'react';

import Header from './Header/Header';
import Footer from './Footer/Footer';

import './App.css';


class App extends Component {

  componentWillMount() {
    // еще один костыль
    const events = JSON.parse(localStorage.getItem('events')) || {};
    if (Object.keys(events).length === 0) {
      console.log('init');
      let obj = {"imaguru":true,"eventsDevBy":true,"meetupBy":true,"minskforfree":true,"sportMts":false,"freeFitnessMinsk":false, "citydogAfisha":true, "citydogVedy":true};
      localStorage.setItem('events', JSON.stringify(obj));
    }


  }
  render() {
    return (
      <div className="app">
        <Header />

        <div className="content">
          {this.props.children}
        </div>
        <div className="sk-spinner sk-spinner-pulse"></div>

        <Footer />
      </div>
    );
  }
}

export default App;
