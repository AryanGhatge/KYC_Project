'use client';

import { persistor, store } from '@/lib/persistor';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner';

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
      <Toaster richColors theme='light' position='top-right' duration={2000} />
    </Provider>
  );
}