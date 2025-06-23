import { configureStore } from '@reduxjs/toolkit';
import paymentsReducer from './paymentsSlice';
import accountsReducer from './accountsSlice';

const store = configureStore({
  reducer: {
    payments: paymentsReducer,
    accounts: accountsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
