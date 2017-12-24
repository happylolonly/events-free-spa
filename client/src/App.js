import React, { Component } from 'react';

import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';

import { renderRoutes } from 'react-router-config';

import './App.css';


class App extends Component {

  componentWillMount() {
    // еще один костыль
    const events = JSON.parse(localStorage.getItem('events')) || {};
    if (Object.keys(events).length === 0) {
      console.log('init');
      let obj = {"imaguru":true,"eventsDevBy":true,"meetupBy":true,"minskforfree":true,"sportMts":false,"freeFitnessMinsk":false, "citydogAfisha":true, "citydogVedy":true, "freeLanguagesMinsk": false};
      localStorage.setItem('events', JSON.stringify(obj));
    }


  }
  render() {
    console.log(this.props.route);
    return (
      <div className="app">
        <Header />

        <div className="content">
          {renderRoutes(this.props.route.routes)}
        </div>
        <div className="sk-spinner sk-spinner-pulse"></div>

        <Footer />
      </div>
    );
  }
}

export default App;
