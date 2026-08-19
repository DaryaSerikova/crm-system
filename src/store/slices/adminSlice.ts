import { createSlice } from "@reduxjs/toolkit";
import type { User } from '../../types/admin.types';
import type { PayloadAction } from "@reduxjs/toolkit";

type AdminUsers = {
  users: User[] | null,
}

const initialState: AdminUsers = {
  users: null,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[] | null>){
      state.users = action.payload;
    }
  }
});

export const { setUsers } = adminSlice.actions;
export default adminSlice.reducer;