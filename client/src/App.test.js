import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';

import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import Routes from './routes';
import App from './App';


describe('initial render', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    const Component = (
      <BrowserRouter>
        <div>{renderRoutes(Routes)}</div>
      </BrowserRouter>
    );
    ReactDOM.render(<Component />, div);
    ReactDOM.unmountComponentAtNode(div);
  });


  it('app renders with enzyme', () => {
    const wrapper = shallow(<App route={{ routes: [] }} />);
    expect(wrapper.find('.app')).toHaveLength(1);
  });

});
