import { useLocation, Navigate, Outlet } from 'react-router';
import { useAppSelector } from '@/store/hooks';



const ProtectedAuth = () => {
  const { isAuth } = useAppSelector((state) => state.auth)
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to='/login' state={{from: location}} replace/>
  }

  return <Outlet />
}

export { ProtectedAuth };