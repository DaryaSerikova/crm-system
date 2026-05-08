import { createSlice } from "@reduxjs/toolkit";
import { setAccessToken } from "../tokenStorage";

const initialState = {
  // isAuth: !!localStorage.getItem('refreshToken'),
  isAuth: false,
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action) {
      state.isAuth = true;
      setAccessToken(action.payload.accessToken); 
    },
    removeAuth(state) {
      state.isAuth = false;
      setAccessToken(null);
    }
  }
})

export const { setAuth, removeAuth } = authSlice.actions;
export default authSlice.reducer;