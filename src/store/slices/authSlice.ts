import { createSlice } from "@reduxjs/toolkit";
import { accessTokenManager } from "../tokenStorage";

const initialState = {
  isAuth: false,
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action) {
      state.isAuth = true;
      accessTokenManager.set(action.payload.accessToken);
    },
    removeAuth(state) {
      state.isAuth = false;
      accessTokenManager.clear();
    }
  }
})

export const { setAuth, removeAuth } = authSlice.actions;
export default authSlice.reducer;