import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Sparkles, Code2, Trophy, Menu, X, GraduationCap, Rocket } from 'lucide-react';
import { useState } from 'react';
import './Layout.css';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/basics', label: '入门功能', icon: Sparkles },
  { path: '/advanced', label: '进阶功能', icon: GraduationCap },
  { path: '/demo', label: '演示', icon: Code2 },
  { path: '/lottery', label: '抽奖', icon: Trophy },
];

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="layout">
      <motion.header 
        className="header glass"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="header-inner container">
          <NavLink to="/" className="logo">
            <div className="logo-icon">
              <Sparkles size={20} />
            </div>
            <span className="logo-text">
              TRAE <span className="logo-highlight">SOLO</span>
            </span>
          </NavLink>

          <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) => 
                  `nav-item ${isActive ? 'nav-item-active' : ''}`
                }
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <a
              href="https://www.trae.ai/solo"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              下载 Trae
            </a>
            <button 
              className="menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="logo-text">
              TRAE <span className="logo-highlight">SOLO</span>
            </span>
            <p className="footer-desc">
              AI 驱动的编码代理 · 从想法到产品
            </p>
          </div>
          <div className="footer-info">
            <p>Built with ❤️ using Trae Solo</p>
            <p className="footer-muted">Hackathon Demo · 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
