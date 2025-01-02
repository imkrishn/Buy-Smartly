import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import rootReducer from './rootReducer'; // Example slice



// Redux Persist Config
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['cartCount'],
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Export the persistor
export const persistor = persistStore(store);

// Export AppDispatch type for usage with useDispatch in components
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
