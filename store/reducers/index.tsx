import { combineReducers } from 'redux';
import { stateListReducer } from './StateReducer';

const rootReducer = combineReducers({
  stateList: stateListReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
