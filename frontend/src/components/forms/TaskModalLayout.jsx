import Modal from '../modals/Modal';
import { useState } from 'react';

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
        <div className="flex flex-col w-[92vw] max-w-lg max-h-[85vh] text-gray-800 dark:text-[#e2e4ea]">
          <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-[#262830]">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              {title}
            </h2>
            <div className="flex items-center gap-2">
              {showDelete && (
                <button
                  type="button"
                  className="p-1.5 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  onClick={() => setConfirmDeleteOpen(true)}
                  title="Видалити"
                >
                  <svg
                    className="w-4 h-4"
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
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#252832] transition-colors"
                title="Закрити"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <div className="space-y-4">{children}</div>
          </div>

          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 dark:border-[#262830] bg-gray-50/70 dark:bg-[#141518]/50">
            {buttons}
          </div>
        </div>
      </Modal>

      {confirmDeleteOpen && (
        <Modal isOpen={true} onClose={() => setConfirmDeleteOpen(false)}>
          <div className="p-6 max-w-sm flex flex-col gap-3">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Підтвердити видалення
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ви впевнені, що хочете безповоротно видалити цю задачу?
            </p>
            <div className="flex items-center justify-end gap-2.5 mt-3">
              <button
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#252832] transition-colors"
                onClick={() => setConfirmDeleteOpen(false)}
              >
                Скасувати
              </button>
              <button
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-500 text-white transition-colors"
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
