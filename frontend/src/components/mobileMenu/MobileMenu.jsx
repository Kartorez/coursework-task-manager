import { createPortal } from 'react-dom';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTeam } from '../../context/TeamContext';

const MobileMenu = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { activeTeam, openTeamModal } = useTeam();

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
      }`}
    >
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-64 max-w-[85vw] bg-white dark:bg-[#18191d] border-l border-gray-200 dark:border-[#2e303a] p-6 flex flex-col gap-3 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-[#2e303a]">
          <span className="font-bold text-gray-900 dark:text-white text-base">Меню</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#252730]"
            aria-label="Закрити меню"
          >
            ✕
          </button>
        </div>

        <NavLink
          to="/"
          onClick={onClose}
          className={({ isActive }) =>
            `px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#23242b] hover:text-gray-900 dark:hover:text-white'
            }`
          }
        >
          Календар
        </NavLink>

        <NavLink
          to="/board"
          onClick={onClose}
          className={({ isActive }) =>
            `px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-600 text-white font-semibold shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#23242b] hover:text-gray-900 dark:hover:text-white'
            }`
          }
        >
          Дошка
        </NavLink>

        {user && (
          <button
            onClick={() => {
              onClose();
              openTeamModal();
            }}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-left flex items-center justify-between text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#23242b] hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <span>👥</span>
              <span>Команда</span>
            </span>
            {activeTeam && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-medium">
                {activeTeam.name}
              </span>
            )}
          </button>
        )}

        {user ? (
          <button
            className="mt-auto px-4 py-2.5 rounded-xl text-sm font-semibold text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            onClick={handleLogout}
          >
            Вийти
          </button>
        ) : (
          <div className="mt-auto flex flex-col gap-2">
            <NavLink
              to="/login"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#23242b] border border-gray-200 dark:border-[#2e303a]"
            >
              Увійти
            </NavLink>
            <NavLink
              to="/register"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-center bg-blue-600 text-white hover:bg-blue-500 shadow-sm"
            >
              Зареєструватись
            </NavLink>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default MobileMenu;
