import React, { Component } from 'react';

import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';
import { Helmet } from 'react-helmet';

import { renderRoutes } from 'react-router-config';
import ErrorBondary from 'components/error-bondary';
import OfflineBar from 'components/offline-bar';
import { isChristmasHolidays } from 'utils/helpers';

import './App.scss';


class App extends Component {

  componentDidMount () {

    if (isChristmasHolidays()) { // add cool snow
      const script = document.createElement('script');

      script.src = './libs/snowstorm-min.js';
      script.onload = () => {
        window.snowStorm.flakesMaxActive = 156;
        window.snowStorm.followMouse = false;
      }

      document.body.appendChild(script);
    }

  }

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
