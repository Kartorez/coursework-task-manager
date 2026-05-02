import Navbar from '../components/navbar/Navbar';
import { Outlet } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useLocation } from 'react-router-dom';

const MinLayout = () => {
  const { openModal } = useModal();
  const location = useLocation();

  const knownPaths = ['/', '/tasks'];
  const hideButton = !knownPaths.includes(location.pathname);
  return (
    <>
      <div className="wrapper">
        <Navbar />
        <main className="content">
          <Outlet />
        </main>
      </div>
      {!hideButton && (
        <button className="add-task-fab" onClick={() => openModal('add')}>
          +
        </button>
      )}
    </>
  );
};

export default MinLayout;
