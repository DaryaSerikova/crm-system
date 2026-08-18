// import { useState, useEffect } from 'react';
// import axios from 'axios';
// // import { setAuth, removeAuth } from '../store/authSlice';
// import { useAppDispatch } from '@/store/hooks';

// export const useAuthInitialization = () => {
//   const [isInitializing, setIsInitializing] = useState(true);
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     const initializeAuth = async () => {
//       const oldRefreshToken = localStorage.getItem('refreshToken');

//       if (!oldRefreshToken) {
//         setIsInitializing(false);
//         return;
//       }

//       try {
//         const res = await axios.post(`${baseUrl}/auth/refresh`, { 
//           refreshToken: oldRefreshToken 
//         });
//         const { accessToken, refreshToken } = res.data;

//         localStorage.setItem('refreshToken', refreshToken);
//         dispatch(setAuth(accessToken));
//       } catch (error) {
//         console.error("Session refresh failed:", error);
//         localStorage.removeItem('refreshToken');
//         dispatch(removeAuth());
//       } finally {
//         setIsInitializing(false);
//       }
//     };

//     initializeAuth();
//   }, [dispatch]);

//   // Возвращаем только флаг готовности
//   return isInitializing;
// };