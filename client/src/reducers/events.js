import types from 'constants/types';

const initialState = {
  isLoading: false,
  data: {
    model: [],
    totalCount: null
  },
  error: null,
}

export default (state=initialState, action) => {
  switch (action.type) {
    case types.LOAD_EVENTS_START:
      return { ...state, isLoading: true };

    case types.LOAD_EVENTS_SUCCESS:
      const { model, totalCount } = action.payload;

      return {
        ...state,
          data: {
          ...state.data,
          model: [ ...state.data.model, ...model ],
          totalCount: totalCount
        },
        isLoading: false
      };

    case types.LOAD_EVENTS_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case types.RESET_EVENTS:
      return { ...state, data: initialState.data };

    default:
      return state;
  }
}
