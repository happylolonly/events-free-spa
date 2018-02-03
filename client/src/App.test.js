import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme'

import App from './App';


it('renders without crashing', () => {
  const div = document.createElement('div');
  const component = shallow(<App route={{ routes: [] }} />);

  ReactDOM.render(<component />, div);
  ReactDOM.unmountComponentAtNode(div);
});
