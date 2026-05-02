import Modal from '../modals/Modal';
import { useState } from 'react';
import './TaskModalLayout.css';

const TaskModalLayout = ({
  isOpen,
  onClose,
  title,
  children,
  buttons,
  showDelete = false,
  onDelete,
}) => {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="modal-window">
          <div className="modal-window__header">
            <h2 className="modal-window__title">{title}</h2>
            {showDelete && (
              <button
                type="button"
                className="modal-window__trash"
                onClick={() => setConfirmDeleteOpen(true)}
                title="Видалити"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
            )}
          </div>

          <div className="modal-window__body">
            <form className="form">{children}</form>
          </div>

          <div className="modal-window__footer">{buttons}</div>
        </div>
      </Modal>

      {confirmDeleteOpen && (
        <Modal isOpen={true} onClose={() => setConfirmDeleteOpen(false)}>
          <div className="confirm-modal">
            <h3 className="confirm-modal__title">Підтвердити видалення</h3>
            <p className="confirm-modal__text">
              Ви впевнені, що хочете видалити задачу?
            </p>
            <div className="confirm-modal__actions">
              <button
                className="button"
                onClick={() => setConfirmDeleteOpen(false)}
              >
                Скасувати
              </button>
              <button
                className="button button--danger"
                onClick={() => {
                  onDelete();
                  setConfirmDeleteOpen(false);
                }}
              >
                Видалити
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default TaskModalLayout;
