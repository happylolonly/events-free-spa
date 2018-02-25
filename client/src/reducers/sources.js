import types from 'constants/types';

const initialState = {
  meetupBy: true,
  eventsDevBy: true,
  imaguru: true,
  minskforfree: true,
  sportMts: false,
  freeFitnessMinsk: false,
  citydogVedy: false,
  citydogAfisha: false,
  freeLanguagesMinsk: false,
  afishaTutBy: true,
};

const saveToStorage = (data) => {
  localStorage.setItem('events', JSON.stringify(data));
}

export default (state=initialState, action) => {
  switch (action.type) {
    case types.UPDATE_SOURCES: {
      const { value, name } = action.payload;

      const newState = { ...state, [name]: value };
      saveToStorage(newState);

      return newState;
    }
  
    case types.TOGGLE_SOURCES: {

      let score = 0;
      Object.keys(state).forEach(item => {
        score += state[item] ? 1 : -1;
      });

      const newState = { ...state };

      Object.keys(newState).forEach(item => {
        newState[item] = !(score >= 0);
      });
      saveToStorage(newState);

      return newState;
    }

    case types.SETUP_SOURCES:
      return action.payload;

    default:
      return state;
  }
}