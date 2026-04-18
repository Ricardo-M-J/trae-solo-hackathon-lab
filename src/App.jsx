import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Basics from './pages/Basics/Basics';
import Advanced from './pages/Advanced/Advanced';
import Demo from './pages/Demo/Demo';
import Lottery from './pages/Lottery/Lottery';
import Chat from './pages/Chat/Chat';

function App() {
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
