import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import './Navbar.css';
import SwitchTheme from './SwitchTheme';
import { useAuth } from '../../context/AuthContext';
import MobileMenu from '../mobileMenu/MobileMenu';
import { useState } from 'react';

const Navbar = () => {
  const { openModal } = useModal();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const knownPaths = ['/', '/tasks'];
  const hideButton = !knownPaths.includes(location.pathname);
  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="navbar-logo">
          <img src="/images/logo.png" alt="Logo" className="logo" />
          Task Manager
        </Link>
        <ul className="navbar-links">
          {!hideButton && (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'navbar-link active' : 'navbar-link'
                }
              >
                <li>Головна</li>
              </NavLink>
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  isActive ? 'navbar-link active' : 'navbar-link'
                }
              >
                <li> Задачі</li>
              </NavLink>
            </>
          )}
        </ul>
        {!hideButton && (
          <button
            className="add-task-button button"
            onClick={() => openModal('add')}
          >
            + Додати
          </button>
        )}
        {!hideButton &&
          (user ? (
            <button className="nav-link form-link" onClick={handleLogout}>
              Вийти
            </button>
          ) : (
            <Link to="/login" className="nav-link form-link">
              Авторизуватись
            </Link>
          ))}
        <div className="navbar-button">
          <button className="burger-btn" onClick={toggleMenu}>
            ☰
          </button>
          <SwitchTheme />
        </div>
      </nav>
      <MobileMenu isOpen={menuOpen} onClose={closeMenu} />
    </header>
  );
};

export default Navbar;
