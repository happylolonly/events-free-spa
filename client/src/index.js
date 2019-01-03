import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

import thunk from 'redux-thunk';

import reducers from './reducers';
import types from 'constants/types';
import Routes from './routes';

import './index.scss';

import registerServiceWorker, { unregister } from './registerServiceWorker';

window.BrowserRouter = BrowserRouter;

const composer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers, composer(
    applyMiddleware(thunk)
  )
);

const sources = JSON.parse(localStorage.getItem('events') || null);
const savedEvents = JSON.parse(localStorage.getItem('savedEvents') || null);

if (sources) {
  store.dispatch({
    type: types.SETUP_SOURCES,
    payload: sources,
  });
}

if (savedEvents) {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMounth = currentDate.getMonth() + 1;

  const { date, data } = savedEvents;

  const [mounth, day] = date.split('_');
  if (currentDay == day && currentMounth == mounth) {
    store.dispatch({
      type: types.SETUP_EVENTS,
      payload: data,
    });

    store.dispatch({
      type: types.SETUP_EVENTS_LIST,
      payload: data,
    });
  } else {
    localStorage.removeItem('savedEvents');
  }
}

ReactDOM.hydrate(
  <Provider store={store}>
    <BrowserRouter>
      <div>{renderRoutes(Routes)}</div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
// unregister();
