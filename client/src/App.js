import React, { Component } from 'react';

import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';

import { renderRoutes } from 'react-router-config';
import ErrorBondary from 'components/error-bondary';
import OfflineBar from 'components/offline-bar';

import './App.scss';


class App extends Component {

  // {/* <div className="sk-spinner sk-spinner-pulse"></div> */}


  render() {
    return (
      <ErrorBondary>
        <div className="app">
          <Header />
          <OfflineBar />

          <div className="content">
            {renderRoutes(this.props.route.routes)}
          </div>

          <Footer />
        </div>
      </ErrorBondary>
    );
  }
}

export default App;
