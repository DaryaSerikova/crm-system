import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react';
import { App as AntdApp} from 'antd';
import App from './App.tsx'
import './index.css'

import { BrowserRouter } from "react-router";
import GlobalAntdSetter from './utils/antdGlobal.tsx';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <AntdApp>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <GlobalAntdSetter />
    </Provider>
  </AntdApp>
  </StrictMode>,
)
