import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import SwitchTheme from './SwitchTheme';
import { useAuth } from '../../context/AuthContext';
import { useTeam } from '../../context/TeamContext';
import TeamModal from '../team/TeamModal';
import MobileMenu from '../mobileMenu/MobileMenu';
import { useState } from 'react';

const Navbar = () => {
  const { openModal } = useModal();
  const { user, logout } = useAuth();
  const { activeTeam, openTeamModal } = useTeam();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const todayDay = new Date().getDate();
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const knownPaths = ['/', '/board'];
  const hideControls = !knownPaths.includes(location.pathname);

  return (
    <header className="w-full sticky top-0 z-40 bg-white/90 dark:bg-[#131417]/90 backdrop-blur-md border-b border-gray-200 dark:border-[#24262d] text-gray-800 dark:text-[#e2e4ea] transition-colors">
      <nav className="flex items-center justify-between px-3 sm:px-6 py-2.5 flex-nowrap gap-2">
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg border-2 border-blue-500 text-blue-600 dark:text-blue-400 font-bold text-sm bg-blue-500/10 group-hover:scale-105 transition-transform">
              {todayDay}
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Task Manager
            </span>
          </Link>
        </div>

        {!hideControls && (
          <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-[#1a1b20] border border-gray-200 dark:border-[#2a2c35] flex-shrink-0">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-2.5 sm:px-3.5 py-1 text-xs sm:text-sm font-medium rounded-lg transition-all ${isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              Календар
            </NavLink>
            <NavLink
              to="/board"
              className={({ isActive }) =>
                `px-2.5 sm:px-3.5 py-1 text-xs sm:text-sm font-medium rounded-lg transition-all ${isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`
              }
            >
              Дошка
            </NavLink>
          </div>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {!hideControls && user && (
            <button
              onClick={openTeamModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#2a2c35] bg-gray-100/80 dark:bg-[#1a1b20] text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/30 text-xs sm:text-sm font-medium transition-all"
              title="Керування командою"
            >
              <span className="text-sm">👥</span>
              <span className="hidden sm:inline">
                {activeTeam ? activeTeam.name : 'Команда'}
              </span>
              {activeTeam && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          )}

          {!hideControls && (
            <button
              onClick={() => openModal('add')}
              className="hidden sm:flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-medium shadow-sm hover:shadow-blue-500/25 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span>Створити</span>
            </button>
          )}

          {!hideControls && (
            user ? (
              <button
                onClick={handleLogout}
                className="hidden md:block px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              >
                Вийти
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden md:block px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
              >
                Увійти
              </Link>
            )
          )}

          <SwitchTheme />

          <button
            onClick={toggleMenu}
            className="sm:hidden p-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-[#1f2026] border border-gray-200 dark:border-[#2a2c35]"
            aria-label="Меню"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      <MobileMenu isOpen={menuOpen} onClose={closeMenu} />
      <TeamModal />
    </header>
  );
};

export default Navbar;
