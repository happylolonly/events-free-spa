import { combineReducers } from 'redux';

import eventsReducer from './events';
import eventReducer from './event';
import sourcesReducer from './sources';

const rootReducer = combineReducers({
  events: eventsReducer,
  event: eventReducer,
  sources: sourcesReducer,
});

export default rootReducer;
