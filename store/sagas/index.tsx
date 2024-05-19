import { all, fork } from 'redux-saga/effects';
import { watchStateSaga } from './StateSaga';

export default function* rootSaga() {
  yield all([
    fork(watchStateSaga)
  ]);
}
