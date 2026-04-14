import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: !!localStorage.getItem('refreshToken'),
  // isAuth: false,
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action) {
      state.accessToken = action.payload.accessToken;
      state.isAuth = true;
    },
    removeAuth(state) {
      state.accessToken =  null;
      state.isAuth = false;
    }
  }
})

export const { setAuth, removeAuth } = authSlice.actions;
export default authSlice.reducer;