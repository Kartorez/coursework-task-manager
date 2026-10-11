import { useState, memo } from 'react';

const AddColumn = memo(({ onAdd }) => {
  const [newColName, setNewColName] = useState('');
  const [showAddCol, setShowAddCol] = useState(false);

  const handleAdd = () => {
    const name = newColName.trim();
    if (!name) return;
    onAdd(name);
    setNewColName('');
    setShowAddCol(false);
  };

  return (
    <div className="flex-shrink-0 w-80">
      {showAddCol ? (
        <div className="p-3.5 rounded-2xl bg-[#f1f3f5] dark:bg-[#18191d] border border-gray-200 dark:border-[#262830] flex flex-col gap-2.5 shadow-sm">
          <input
            className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-[#1f2026] text-gray-900 dark:text-white border border-gray-300 dark:border-[#2e303a] focus:border-blue-500 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
            value={newColName}
            onChange={(e) => setNewColName(e.target.value)}
            placeholder="Назва колонки..."
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <div className="flex items-center gap-2">
            <button
              className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
              onClick={handleAdd}
            >
              Додати
            </button>
            <button
              className="py-1.5 px-3 rounded-lg bg-gray-200 dark:bg-[#242630] hover:bg-gray-300 dark:hover:bg-[#2c2f3b] text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs font-medium transition-colors"
              onClick={() => setShowAddCol(false)}
            >
              Скасувати
            </button>
          </div>
        </div>
      ) : (
        <button
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-dashed border-gray-300 dark:border-[#2a2c35] hover:border-blue-500/50 hover:bg-gray-100/70 dark:hover:bg-[#18191d]/50 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-all"
          onClick={() => setShowAddCol(true)}
        >
          <span className="text-base leading-none">+</span>
          <span>Додати колонку</span>
        </button>
      )}
    </div>
  );
});

export default AddColumn;
