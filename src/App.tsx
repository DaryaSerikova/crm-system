import { Routes, Route } from 'react-router';
import { useNavigate } from 'react-router';
import type { MenuProps } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { Menu } from 'antd';
import TodoListPage from './pages/TodoListPage/TodoListPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import s from './App.module.scss';



type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  { key: '/', label: 'Список задач' },
  { key: '/profile', label: 'Профиль' },
]

function App() {
  const navigate = useNavigate();

  const handleMenuClick = (e: MenuInfo) => {
    navigate(e.key);
  };

  return (
    <div className={s.app}>
      <div style={{ maxWidth: 256 }}>
        <Menu
          onClick={handleMenuClick}
          defaultSelectedKeys={[window.location.pathname]}
          defaultOpenKeys={['sub1']}
          mode="inline"
          items={items}
        />
      </div>
      <Routes>
        <Route path="/" element={<TodoListPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  )
}

export default App;
