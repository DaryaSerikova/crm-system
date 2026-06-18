import { Routes, Route } from 'react-router';
import TodoListPage from './pages/TodoListPage/TodoListPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import { Layout } from './components/Layout/Layout';
import { ProtectedAuth } from './components/ProtectedAuth/ProtectedAuth';
import ThemeProvider from './components/ThemeProvider/ThemeProvider';
import s from './App.module.scss';
import LayoutAuth from './components/LayoutAuth/LayoutAuth';
import UsersPage from './pages/UsersPage/UsersPage';
import UserPage from './pages/UserPage/UserPage';



function App() {

  return (
    <ThemeProvider>
      <div className={s.app}>
        <Routes>
          
          <Route element={<ProtectedAuth />}>
            <Route path="/" element={<Layout/>}>
              <Route path="/" element={<TodoListPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/:id" element={<UserPage />} />

            </Route>
          </Route>

          <Route path="/" element={<LayoutAuth/>}>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/register" element={<RegisterPage />}></Route>
          </Route>

        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App;
