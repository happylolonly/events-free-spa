import axios from 'axios';
import { createAction } from 'redux-actions';
import types from '../constants/types';
import { API } from '../constants/config';

export const startLoadEvent = createAction(types.LOAD_EVENT_START);
export const eventLoadedWithSuccess = createAction(types.LOAD_EVENT_SUCCESS, (data) => data);
export const eventLoadedWithError = createAction(types.LOAD_EVENT_ERROR, (error) => error);

export const startLoadEvents = createAction(types.LOAD_EVENTS_START);
export const eventsLoadedWithSuccess = createAction(types.LOAD_EVENTS_SUCCESS, (data) => data);
export const eventsLoadedWithError = createAction(types.LOAD_EVENTS_ERROR, (error) => error);

export const setupEventList = createAction(types.SETUP_EVENTS_LIST, (data) => data);
export const allEventsLoadedWithSuccess = createAction(types.LOAD_ALL_EVENTS_SUCCESS, (data) => data);

export const loadEvents = config => {
  return async (dispatch, getState) => {
    dispatch(startLoadEvents());

    const sources = getState().sources;

    const concatedSourcesKeys = Object.keys(sources).join(',');

    const { search = '', day = 'today', offset = 0 } = config;

    return axios.get(`${API}/events`, {
      params: {
        day,
        offset,
        search,
        sources: concatedSourcesKeys,
        limit: 10,
      },
    }).then(({ data }) => {
      const { model, totalCount } = data;
      dispatch(eventsLoadedWithSuccess({ model, totalCount, day }));
    }).catch((error) => {
      dispatch(eventsLoadedWithError(error));
    });
  };
};

export const loadEvent = id => {
  return async dispatch => {
    dispatch(startLoadEvent());

    return axios.get(`${API}/event`, {
      params: {
        id,
      },
    }).then(({ data }) => {
      dispatch(eventLoadedWithSuccess(data[0]));
    }).catch((error) => {
      dispatch(eventLoadedWithError(error));
    });
  };
};

export const loadAllEvents = () => {
  return async (dispatch, getState) => {
    const sources = getState().sources;

    const concatedSourcesKeys = Object.keys(sources).join(',');

    dispatch(startLoadEvent());

    return axios.get(`${API}/events`, {
      params: {
        sources: concatedSourcesKeys,
        day: 'today',
        full: true,
      },
    }).then(({ data: { model } }) => {
      dispatch(setupEventList(model));

      dispatch(allEventsLoadedWithSuccess(model));
    }).catch((error) => {
      dispatch(eventLoadedWithError(error));
    });
  };
};

export const resetEvents = () => {
  return {
    type: types.RESET_EVENTS,
  };
};
