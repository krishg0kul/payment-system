import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Payment } from '../types';

interface PaymentsState {
  items: Payment[];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentsState = {
  items: [],
  loading: false,
  error: null,
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setPayments(state, action: PayloadAction<Payment[]>) {
      state.items = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setPayments, setLoading, setError } = paymentsSlice.actions;
export default paymentsSlice.reducer;
