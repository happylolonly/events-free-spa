import types from 'constants/types';

const initialState = {
  isLoading: false,
  data: {
    model: [],
    totalCount: null,
  },
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOAD_EVENTS_START:
      return { ...state, isLoading: true };

    case types.LOAD_EVENTS_SUCCESS:
      const { model, totalCount, day } = action.payload;

      return {
        ...state,
        data: {
          ...state.data,
          model: [...state.data.model, ...model],
          totalCount: totalCount,
          day,
        },
        isLoading: false,
      };

    case types.LOAD_EVENTS_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case types.RESET_EVENTS:
      return { ...state, data: initialState.data };

    case types.SETUP_EVENTS_LIST:
      const obj = {
        ...state,
        isLoading: false,
        data: {
          model: Object.keys(action.payload).map(item => action.payload[item]),
          day: 'today',
        },
      };
      return obj;

    default:
      return state;
  }
};
