import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Basics from './pages/Basics/Basics';
import Advanced from './pages/Advanced/Advanced';
import Demo from './pages/Demo/Demo';
import Lottery from './pages/Lottery/Lottery';
import Chat from './pages/Chat/Chat';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // 检查是否有保存的原始路径
    const redirect = sessionStorage.redirect;
    if (redirect) {
      sessionStorage.removeItem('redirect');
      // 提取路径部分（去掉 base）
      const basePath = import.meta.env.VITE_BASE_PATH || '/';
      const path = redirect.replace(basePath, '');
      if (path && path !== '/') {
        navigate(path, { replace: true });
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="basics" element={<Basics />} />
        <Route path="advanced" element={<Advanced />} />
        <Route path="demo" element={<Demo />} />
        <Route path="lottery" element={<Lottery />} />
        <Route path="chat" element={<Chat />} />
      </Route>
    </Routes>
  );
}

export default App;