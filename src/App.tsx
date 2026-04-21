import { Routes, Route } from 'react-router';
import { ConfigProvider } from 'antd';
import TodoListPage from './pages/TodoListPage/TodoListPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import { Layout } from './components/Layout/Layout';
import { ProtectedAuth } from './components/ProtectedAuth/ProtectedAuth';
import s from './App.module.scss';



function App() {

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          colorLink: 'rgba(127, 38, 91, 1)',       // Цвет ссылки в обычном состоянии
          colorLinkHover: 'rgba(127, 38, 91, 0.8)',  // Цвет при наведении (Hover)
          colorLinkActive: '#096dd9', // Цвет при нажатии (Active)
          
          // Если нужно убрать или изменить подчеркивание
          linkDecoration: 'underline', // По умолчанию 'none'
          linkHoverDecoration: 'none',
        },
        components: {
          Form: {
            labelColor: 'rgba(130, 130, 130, 1)',      // Цвет всех label в приложении
            labelFontSize: 14,          // Размер шрифта
            // labelHeight: 32,            // Высота строки (влияет на вертикальное выравнивание)
          },
          Button: {
            colorPrimary: 'rgba(127, 38, 91, 1)',      // Цвет основной кнопки
            borderRadius: 6,              // Скругление углов
            algorithm: true,   
            fontWeight: 800,
            contentFontSize: 18,
          },
          Input: {
            colorBorder: 'rgba(222, 210, 217, 1)',       // Цвет рамки инпута
            activeBorderColor: 'rgba(127, 38, 91, 1)', // Цвет при фокусе
            hoverBorderColor: 'rgba(127, 38, 91, 1)', 
            activeShadow: '0 0 0 2px rgba(127, 38, 91, 0.1)', // Тень того же оттенка
          },
          Checkbox: {
            colorPrimary: 'rgba(127, 38, 91, 1)',       // Цвет фона при выборе (Checked)
            colorPrimaryHover: 'rgba(222, 210, 217, 1)',  // Цвет рамки при наведении
            borderRadiusSM: 4,             // Скругление самого квадратика
            colorWhite: '#fff',            // Цвет самой галочки внутри
          },
          Menu: {
            itemBg: 'rgba(249, 249, 249, 1)', 
            itemColor: 'rgba(114, 114, 114, 1)',

            itemHoverBg: 'rgba(242, 242, 242, 1)',      // Фон при наведении
            itemHoverColor: 'rgba(0, 0, 0, 1)',   // Цвет текста при наведении
            
            itemSelectedBg: 'rgba(242, 242, 242, 1)',     // Фон выбранного элемента
            itemSelectedColor: 'rgba(0, 0, 0, 1)',  // Цвет текста выбранного элем

            itemActiveBg: 'rgba(242, 242, 242, 1)',
          }
        },
        
      }}
    >
    <div className={s.app}>
      <Routes>
        <Route element={<ProtectedAuth />}>
          <Route path="/" element={<Layout/>}>
            <Route path="/" element={<TodoListPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
      </Routes>
    </div>
  </ConfigProvider>
  )
}

export default App;
