import { createContext, useContext, useState } from 'react';
import AddTaskModal from '../components/modals/AddTaskModal';
import EditTaskModal from '../components/modals/EditTaskModal';
import ViewTaskModal from '../components/modals/ViewTaskModal';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null);

  const openModal = (component, props = {}) => {
    setModal({ component, props });
  };

  const closeModal = () => setModal(null);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {modal?.component === 'add' && (
        <AddTaskModal isOpen onClose={closeModal} {...modal.props} />
      )}
      {modal?.component === 'edit' && (
        <EditTaskModal isOpen onClose={closeModal} {...modal.props} />
      )}
      {modal?.component === 'view' && (
        <ViewTaskModal isOpen onClose={closeModal} {...modal.props} />
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
