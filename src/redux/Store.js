import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, 
         FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import AuthSlicer from './slices/AuthSlicer';
import TokenReducer from './slices/TokenReducer';

const rootReducer = combineReducers({
  auth: AuthSlicer,
  token: TokenReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
