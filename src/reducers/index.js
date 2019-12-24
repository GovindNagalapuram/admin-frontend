import { combineReducers } from 'redux';

import filtersReducer from '../reducers/filters';
import openOrCloseModalReducer from '../reducers/modal';

const allReducers = combineReducers({
    filtersReducer,
    openOrCloseModalReducer
});

export default allReducers;
