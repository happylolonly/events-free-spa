import React, { Component } from 'react';

import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import { Helmet } from 'react-helmet';

import { renderRoutes } from 'react-router-config';
import ErrorBondary from 'components/error-bondary';
import OfflineBar from 'components/offline-bar';

import './App.scss';


class App extends Component {
  constructor(props) {
    super(props);

    window.browserHistory = this.props.history;
  }

  // {/* <div className="sk-spinner sk-spinner-pulse"></div> */}


  render() {
    return (
      <ErrorBondary>
        <Helmet>
          <title>Events Free</title>
        </Helmet>

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
