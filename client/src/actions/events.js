import axios from 'axios';

import types from '../constants/types';
import { API } from '../constants/config';


export const loadEvents = (config) => {
  return async (dispatch, getState) => {
    dispatch({ type: types.LOAD_EVENTS_START });

    // const events = JSON.parse(localStorage.getItem('events') || null) || {};
    const events = getState().sources;
    var keys = Object.keys(events);

    var filtered = keys.filter(function(key) {
        return events[key]
    });

    let sources = filtered.join(',');

    const { search='', day='today', offset=0 } = config;

    try {
      const events = await axios.get(`${API}/events`, {
        params: {
          day,
          offset,
          search,
          sources
        }
      });
      console.log(events);
      const { model, totalCount } = events.data;

      dispatch({ type: types.LOAD_EVENTS_SUCCESS, payload: {model, totalCount} });
    } catch (error) {
      dispatch({ type: types.LOAD_EVENTS_ERROR, payload: error });
    }

  }

};

export const loadEvent = (id) => {

  return async dispatch => {

    dispatch({ type: types.LOAD_EVENT_START });

    try {
      const event = await axios.get(`${API}/event`, {
        params: {
          id
        }
      });

      dispatch({ type: types.LOAD_EVENT_SUCCESS, payload: event.data[0] });
    } catch (error) {
      dispatch({ type: types.LOAD_EVENT_ERROR, payload: error });
    }

  }

};

export const loadAllEvents = () => {

  return async (dispatch, getState) => {

    // const events = JSON.parse(localStorage.getItem('events') || null) || {};
    const events = getState().sources;
    var keys = Object.keys(events);

    var filtered = keys.filter(function(key) {
        return events[key]
    });

    let sources = filtered.join(',');

    dispatch({ type: types.LOAD_EVENT_START });

    try {
      const event = await axios.get(`${API}/events`, {
        params: {
          sources,
          day: 'today',
          full: true,
        }
      });

      // debugger;

      dispatch({ type: types.LOAD_ALL_EVENTS_SUCCESS, payload: event.data.model });
    } catch (error) {
      dispatch({ type: types.LOAD_EVENT_ERROR, payload: error });
    }

  }

};


export const resetEvents = () => {
  return {
    type: types.RESET_EVENTS,
  }
}
