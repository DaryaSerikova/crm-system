import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice'
import adminSlice from './slices/adminSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    users: adminSlice,
  },
});

// Типизация RootState и AppDispatch для использования в хуках
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;