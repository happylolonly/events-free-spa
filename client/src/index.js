import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';


import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import reducers from './reducers';
import Routes from './routes';

import './index.scss';

import registerServiceWorker from './registerServiceWorker';

const logger = createLogger({ collapsed: true });

const createStoreWithMiddleware = applyMiddleware(logger, thunk)(createStore);

ReactDOM.hydrate(
	<Provider store={createStoreWithMiddleware(reducers)}>
		<BrowserRouter>
			<div>{renderRoutes(Routes)}</div>
		</BrowserRouter>
	</Provider>,
  document.getElementById('root')
);

registerServiceWorker();


const data = JSON.parse(localStorage.getItem('events') || null);

if (data) {
	createStoreWithMiddleware.dispatch({
		type: '',
		payload: data,
	})
}