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

    case types.LOAD_ALL_EVENTS_SUCCESS:
      
      const { payload } = action;
      // debugger;

      const obj = {};

      payload.forEach(item => {
        const { _id } = item;

        obj[_id] = {...item, id: _id};
      })

      const date = new Date();
      const day = date.getDate();
      const mounth = date.getMonth() + 1;


      localStorage.setItem('savedEvents', JSON.stringify({
        date: mounth + '_' + day,
        data: obj,
      }));

      return {
        ...state,
        data: { ...state.data, ...obj },
        isLoading: false
      };

      case types.SETUP_EVENTS:
      // debugger;
        return { ...state,
          isLoading: false,
          data: action.payload
        };


    default:
      return state;
  }
}
