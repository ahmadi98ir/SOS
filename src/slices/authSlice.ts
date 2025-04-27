import { createSlice } from "@reduxjs/toolkit";

export type UserRole = "driver" | "admin";

export interface AuthState {
  userId: string;
  name: string;
  role: UserRole;
}

const initialState: AuthState = {
  userId: "mock-user-id-1",
  name: "Ali MotoAdmin",
  role: "admin",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {}, // No actions for now, static mock
});

export const authReducer = authSlice.reducer;
