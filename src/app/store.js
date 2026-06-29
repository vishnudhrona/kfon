import { combineReducers, configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import { ACTION_TYPES } from '@/features/others/common/actions';

import rootReducers from './rootReducers';
import { middlewareList as rtkMiddlewares, reducers as rtkReducers } from './rootRTK';
import rootSaga from './rootSaga';
const sagaMiddleware = createSagaMiddleware();

const middleWares = [sagaMiddleware, ...rtkMiddlewares];

if (import.meta.env.MODE === 'development') {
  middleWares.push(logger);
}

// export const store = configureStore({
//     reducer: rtkReducers,
//     middleware: () =>middleWares
// })

// setupListeners(store.dispatch)

const combinedReducer = combineReducers({
  ...rootReducers,
  ...rtkReducers
});

const CORPORATE_SESSION_KEYS = ['proposalLocationIDs', 'proposalEnquiryId', 'splitFilterLocationIds'];

const rootReducer = (state, action) => {
  let newState = state;
  if (action.type === ACTION_TYPES.LOGOUT_USER) {
    localStorage.clear();
    CORPORATE_SESSION_KEYS.forEach((key) => sessionStorage.removeItem(key));
    newState = undefined;
  }
  return combinedReducer(newState, action);
};

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'onboarding-key/SUBMIT_ONBOARDING_SINGLE_DOCUMENT',
          'onboarding-key/SUBMIT_ONBOARDING_SUPPORTING_DOCUMENTS',
          'corporate/UPDATE_ENQUIRY_LOCATION',
          'corporate/SUBMIT_ENQUIRY_LOCATION',
          'corporate/DELETE_KYC_DOCUMENT',
          'corporate/SAVE_CUSTOMER_BASIC_DETAILS',
          'corporate/UPDATE_CUSTOMER_BASIC_DETAILS',
          'corporate/UPDATE_CUSTOMER_GST_DETAILS',
          'corporate/UPDATE_CUSTOMER_PAN_DETAILS',
          'corporate/UPLOAD_KYC_DOCUMENT',
          'corporate/FETCH_PROPOSAL_SEND_PREVIEW',
          'corporate/UPDATE_PROPOSAL_STATUS',
          'inventory/CREATE_DEVICE_TYPE',
          'inventory/CREATE_DEVICE_MAKE',
          'inventory/CREATE_DEVICE_CATEGORY',
          'inventory/FETCH_STOCK_BY_PONO',
          'crm/FETCH_SUBSCRIBER_BY_NUMBER'
        ]
      }
    }).concat(...middleWares)
});

sagaMiddleware.run(rootSaga);
