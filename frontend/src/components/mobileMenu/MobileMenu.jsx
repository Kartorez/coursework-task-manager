import { NavLink } from 'react-router-dom';
import './MobileMenu.css';
import { useAuth } from '../../context/AuthContext';

const MobileMenu = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <>
      <div
        className={`menu-overlay ${isOpen ? 'show' : ''}`}
        onClick={onClose}
      />

      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <NavLink to="/" onClick={onClose}>
          Головна
        </NavLink>

        {user ? (
          <>
            <NavLink to="/tasks" onClick={onClose}>
              Задачі
            </NavLink>

            <button className="menu-btn-link" onClick={handleLogout}>
              Вийти
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={onClose}>
              Увійти
            </NavLink>

            <NavLink to="/register" onClick={onClose}>
              Зареєструватись
            </NavLink>
          </>
        )}
      </div>
    </>
  );
};

export default MobileMenu;
