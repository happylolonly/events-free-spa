import types from '../constants/types';


export const updateSources = (value, name) => {
    return {
        type: types.UPDATE_SOURCES,
        payload: {value, name}
    }
}

export const toggleSources = () => {
    return {
        type: types.TOGGLE_SOURCES,
    }
}
