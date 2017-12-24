import types from 'constants/types';

const initialState = {
  isLoading: false,
  data: {},
  error: null,
}

export default (state=initialState, action) => {
  switch (action.type) {
    case types.LOAD_EVENT_START:
      return { ...state, isLoading: true };

    case types.LOAD_EVENT_SUCCESS:
      return {
        ...state,
        data: { ...state.data, [action.payload._id]: action.payload },
        isLoading: false
      };

    case types.LOAD_EVENT_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    default:
      return state;
  }
}
