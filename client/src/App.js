import React, { Component } from 'react';

import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';

import { renderRoutes } from 'react-router-config';

import './App.scss';


class App extends Component {

  // {/* <div className="sk-spinner sk-spinner-pulse"></div> */}


  render() {
    return (
      <div className="app">
        <Header />

        <div className="content">
          {renderRoutes(this.props.route.routes)}
        </div>

        <Footer />
      </div>
    );
  }
}

export default App;
