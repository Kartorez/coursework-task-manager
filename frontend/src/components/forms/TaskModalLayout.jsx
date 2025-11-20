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
  taskTitle,
}) => {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="form-layout">
          <div className="form-container modal-window">
            <div className="form-container__header">
              <h2 className="form-title">{title}</h2>

              {showDelete && (
                <button
                  type="button"
                  className="button--danger header-delete-btn"
                  onClick={() => setConfirmDeleteOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon-trash"
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

            <div className="form-scroll">
              <form className="form">{children}</form>
            </div>

            <div className="form-footer modal-buttons">{buttons}</div>
            {showDelete && (
              <button
                type="button"
                className="modal-delete-btn"
                onClick={() => setConfirmDeleteOpen(true)}
              >
                Видалити
              </button>
            )}
          </div>
        </div>
      </Modal>

      {confirmDeleteOpen && (
        <Modal isOpen={true} onClose={() => setConfirmDeleteOpen(false)}>
          <div className="confirm-modal">
            <h3>Підтвердити видалення</h3>
            <p>Ви впевнені, що хочете видалити задачу?</p>

            <div className="confirm-actions">
              <button
                className="button cancel-btn"
                onClick={() => setConfirmDeleteOpen(false)}
              >
                Скасувати
              </button>

              <button
                className="button danger-btn"
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
