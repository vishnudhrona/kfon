import { has, set, values } from 'lodash-es';

import modules from '@/features/index';

const reducers = {};

values(modules).forEach((submodule) => {
  if (has(submodule, 'STATE_REDUCER_KEY') && has(submodule, 'reducer')) {
    set(reducers, `${submodule.STATE_REDUCER_KEY}`, submodule.reducer);
  }
});

const rootReducer = {
  ...reducers
};

export default rootReducer;
