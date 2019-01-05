import axios from 'axios';
import { createAction } from 'redux-actions';
import types from '../constants/types';
import { API } from '../constants/config';

export const startLoadEvent = createAction(types.LOAD_EVENT_START);
export const eventLoadedWithSuccess = createAction(types.LOAD_EVENT_SUCCESS);
export const eventLoadedWithError = createAction(types.LOAD_EVENT_ERROR);

export const startLoadEvents = createAction(types.LOAD_EVENTS_START);
export const eventsLoadedWithSuccess = createAction(types.LOAD_EVENTS_SUCCESS);
export const eventsLoadedWithError = createAction(types.LOAD_EVENTS_ERROR);

export const setupEventList = createAction(types.SETUP_EVENTS_LIST);
export const allEventsLoadedWithSuccess = createAction(types.LOAD_ALL_EVENTS_SUCCESS);

export const loadEvents = config => {
  return async (dispatch, getState) => {
    dispatch(startLoadEvents());

    const sources = getState().sources;

    const activeSources = Object.keys(sources)
      .filter(key => sources[key])
      .join(',');

    const { search = '', day = 'today', offset = 0 } = config;

    try {
      const events = await axios.get(`${API}/events`, {
        params: {
          day,
          offset,
          search,
          sources: activeSources,
          limit: 10,
        },
      });
      const { model, totalCount } = events.data;

      dispatch(eventsLoadedWithSuccess({ model, totalCount, day }));
    } catch (error) {
      dispatch(eventsLoadedWithError(error));
    }
  };
};

export const loadEvent = id => {
  return async dispatch => {
    dispatch(startLoadEvent());

    try {
      const { data } = await axios.get(`${API}/event`, {
        params: {
          id,
        },
      });

      dispatch(eventLoadedWithSuccess(data[0]));
    } catch (error) {
      dispatch(eventLoadedWithError(error));
    }
  };
};

export const loadAllEvents = () => {
  return async (dispatch, getState) => {
    const sources = getState().sources;

    const activeSources = Object.keys(sources)
      .filter(key => sources[key])
      .join(',');

    dispatch(startLoadEvent());

    try {
      const {
        data: { model },
      } = await axios.get(`${API}/events`, {
        params: {
          sources: activeSources,
          day: 'today',
          full: true,
        },
      });

      dispatch(setupEventList(model)); // возможно костыль, потом посмотреть

      dispatch(allEventsLoadedWithSuccess(model));
    } catch (error) {
      dispatch(eventLoadedWithError(error));
    }
  };
};

export const resetEvents = () => {
  return {
    type: types.RESET_EVENTS,
  };
};
