import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, browserHistory } from 'react-router';

import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import reducers from './reducers';
import routes from './routes';

import './index.css';

import registerServiceWorker from './registerServiceWorker';

const logger = createLogger({ collapsed: true });

const createStoreWithMiddleware = applyMiddleware(logger, thunk)(createStore);

ReactDOM.render(
	<Provider store={createStoreWithMiddleware(reducers)}>
		<Router history={browserHistory} routes={routes} />
	</Provider>,
  document.getElementById('root')
);

registerServiceWorker();
