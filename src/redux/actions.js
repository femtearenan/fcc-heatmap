// Your actions and action constants here

// Action constants can be defined like this:
// export const AN_ACTION = "AN_ACTION";

// Actions should have a basic structure like this, optionally with some payload for "someData":
// export const basicAction = someData => ({
//     type: AN_ACTION,
//     payload: {
//         data: someData
//     }
// });

export const REQUEST_DATA = "REQUEST_DATA";
export const RESOLVED_GET_DATA = "RESOLVED_GET_DATA";
export const FAILED_GET_DATA = "FAILED_GET_DATA";

export const getHeatData = (dataType) => {

    return function (dispatch) {
        dispatch(requestData());

        return fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
            .then(response => response.json(), error => console.log('An error occured: ', error))
            .then(json => dispatch(resolvedGetData(json)));
    }
}

export const requestData = () => {
    return {
        type: REQUEST_DATA
    }
}

export const resolvedGetData = (json) => {
    return {
        type: RESOLVED_GET_DATA,
        payload: {
            data: json
        }
    }
}