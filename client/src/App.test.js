import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';

import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import Routes from './routes';
import App from './App';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

describe('initial render', () => {
  it('renders full app without crashing', () => {
    const div = document.createElement('div');
    const Component = (
      <Provider store={createStoreWithMiddleware(reducers)}>
        <BrowserRouter>
          <div>{renderRoutes(Routes)}</div>
        </BrowserRouter>
      </Provider>
    );
    ReactDOM.render(Component, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('app renders with enzyme', () => {
    const wrapper = shallow(<App route={{ routes: [] }} />);
    expect(wrapper.find('.app')).toHaveLength(1);
  });
});
