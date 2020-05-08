// Your basic state management logic here
import {REQUEST_DATA, RESOLVED_GET_DATA, FAILED_GET_DATA} from './actions';

const initialState = {
    isFetching: false,
    hasData: false,
    baseTemp: 0,
    data: []
};

function appReducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST_DATA:
            return Object.assign({}, state, {
                isFetching: true
            });
        case RESOLVED_GET_DATA:
            return Object.assign({}, state, {
                isFetching: false,
                hasData: true,
                baseTemp: action.payload.data.baseTemperature,
                data: action.payload.data.monthlyVariance
            });
        case FAILED_GET_DATA:
            return Object.assign({}, state, {
                isFetching: false,
                hasData: false,
            });
        default:
            return state;
    }
}

export default appReducer;