import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  username: null,
  email: null,
  phoneNumber: null,
  isBlocked: null,
  roles: null,
  date: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.phoneNumber = action.payload.phoneNumber;
      state.email = action.payload.email;
      state.isBlocked = action.payload.isBlocked;
      state.roles = action.payload.roles;
      state.date = action.payload.date;
    }
  }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;