import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account } from '../types';

interface AccountsState {
  items: Account[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountsState = {
  items: [],
  loading: false,
  error: null,
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccounts(state, action: PayloadAction<Account[]>) {
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

export const { setAccounts, setLoading, setError } = accountsSlice.actions;
export default accountsSlice.reducer;
