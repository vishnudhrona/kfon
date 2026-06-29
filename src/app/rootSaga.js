import { has, values } from 'lodash-es';
import { all, fork } from 'redux-saga/effects';

import modules from '@/features/index';
const sagas = [];

values(modules).forEach((subModule) => {
  if (has(subModule, 'STATE_REDUCER_KEY') && has(subModule, 'saga')) {
    sagas.push(fork(subModule.saga));
  }
});

export default function* rootSaga() {
  yield all([...sagas]);
}
