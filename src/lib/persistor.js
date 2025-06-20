import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import authReducer from '@/slices/authSlice';
import formReducer from '@/app/store/slices/formSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  form: formReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
  debug: true
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER']
      }
    })
});

export const persistor = persistStore(store);