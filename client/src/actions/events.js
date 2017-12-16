import axios from 'axios';

import types from '../constants/types';

import { API } from '../constants/config';


export const loadEvents = () => {

  return async dispatch => {

    dispatch({ type: types.LOAD_EVENTS_START });

    try {
      const events = axios.get(`${API}/events`, {
        params: {
          day,
          offset,
          search,
          sources
        }
      });

      dispatch({ type: types.LOAD_EVENTS_SUCCESS, payload: events });
    } catch (error) {
      dispatch({ type: types.LOAD_EVENTS_ERROR });
    }

  }

};

export const loadEvent = (id) => {

  return async dispatch => {

    dispatch({ type: types.LOAD_EVENT_START });

    try {
      const event = axios.get(`${API}/event`, {
        params: {
          id
        }
      });

      dispatch({ type: types.LOAD_EVENT_SUCCESS, payload: event });
    } catch (error) {
      dispatch({ type: types.LOAD_EVENT_ERROR });
    }

  }

};
