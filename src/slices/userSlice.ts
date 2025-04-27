import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isAuthenticated: boolean;
  name: string;
  email: string;
}

const initialState: UserState = {
  isAuthenticated: false,
  name: '',
  email: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.isAuthenticated = true;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.name = '';
      state.email = '';
    },
  },
});

export const { login, logout } = userSlice.actions;
export const userReducer = userSlice.reducer;
