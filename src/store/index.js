import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import allReducers from '../reducers';

const makeStore = compose(
    applyMiddleware(thunk)
)
(createStore)
(allReducers);

export default makeStore;