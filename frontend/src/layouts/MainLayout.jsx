import Navbar from '../components/navbar/Navbar';
import { Outlet } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useLocation } from 'react-router-dom';

const MainLayout = () => {
  const { openModal } = useModal();
  const location = useLocation();

  const knownPaths = ['/', '/board'];
  const hideButton = !knownPaths.includes(location.pathname);

  return (
    <div className="h-screen max-h-screen flex flex-col bg-[#f8f9fa] dark:bg-[#131417] text-[#1a1b20] dark:text-[#e2e4ea] selection:bg-blue-600 selection:text-white transition-colors overflow-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Outlet />
      </main>

      {!hideButton && (
        <button
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 aspect-square rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center text-3xl font-light shadow-xl shadow-blue-600/40 z-50 transition-transform active:scale-90"
          onClick={() => openModal('add')}
          aria-label="Створити задачу"
        >
          +
        </button>
      )}
    </div>
  );
};

export default MainLayout;
