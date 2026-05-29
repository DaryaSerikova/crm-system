import { useState, useEffect } from 'react';
import type { MenuInfo } from 'rc-menu/lib/interface';
import type { Profile } from '@/types/user.types';
import type { MenuProps } from 'antd';
import { Outlet, useNavigate } from 'react-router';
import { useAppDispatch } from '@/store/hooks';
import { removeAuth } from '@/store/slices/authSlice';
import { setUser } from '@/store/slices/userSlice';
import { Button, Menu, Avatar } from 'antd';
import { UserOutlined, DownOutlined } from '@ant-design/icons';
import LogoIcon from '@/assets/icons/LogoIcon';
import { openNotification } from '@/utils/errors';
import { getUserProfile } from '@/api/api';
import s from './Layout.module.scss';


type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  { key: '/', label: 'Список задач' },
  { key: '/profile', label: 'Профиль' },
]

const Layout = () => {
  const [userProfile, setUserProfile] = useState<Profile | undefined>({} as Profile | undefined)

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const fetchAndSetUserProfile = async () => {
    try {
      const profile = await getUserProfile();
      dispatch(setUser(profile));
      setUserProfile(profile);
    } catch (err: unknown) {
      if (err instanceof Error) {
        openNotification({
          type: 'error',
          title: 'ERROR',
          description: 'User Profile is failed'
        })
      }
    }
  }

  useEffect(() => {
    fetchAndSetUserProfile();
  }, []);

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
        <div className={s.logo}>
          <LogoIcon />
          <p className={s.text}>Venture</p>
        </div>
        <div className={s.menuWithLogout}>
          <Menu
            onClick={handleMenuClick}
            defaultSelectedKeys={[window.location.pathname]}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
            style={{ borderRight: 'none' }} 
          />
          <div className={s.userLogout}>
            <div className={s.user}>
              <Avatar size={36} icon={<UserOutlined />} />
              <p className={s.text}>{userProfile?.username}</p>
              <DownOutlined onClick={() => setIsOpen(!isOpen)} className={`${s.arrow} ${isOpen ? s.isOpen : ''}`}/>
            </div>
            {isOpen ? 
              <Button
                onClick={logout}
                className={s.logout}
              >
                Logout
              </Button>
              : <></>}
          </div>
        </div>
      </div>
      <Outlet/>
    </>
  )
}

export { Layout }