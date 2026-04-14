import type { MenuInfo } from 'rc-menu/lib/interface';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router';
import { useAppDispatch } from '@/store/hooks';
import { removeAuth } from '@/store/slices/authSlice';
import s from './Layout.module.scss';


type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  { key: '/', label: 'Список задач' },
  { key: '/profile', label: 'Профиль' },
]

const Layout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleMenuClick = (e: MenuInfo) => {
    navigate(e.key);
  };

  const logout = () => {
    dispatch(removeAuth());
    localStorage.removeItem('refreshToken');
  }

  return (
    <>
      <div className={s.sidebar}>
        <Menu
          onClick={handleMenuClick}
          defaultSelectedKeys={[window.location.pathname]}
          defaultOpenKeys={['sub1']}
          mode="inline"
          items={items}
        />
        <Button
          onClick={logout}
        >
          Logout
        </Button>
      </div>
      <Outlet/>
    </>
  )
}

export { Layout }