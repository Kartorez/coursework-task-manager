import { useState } from 'react';
import { useTaskTypes } from '../../context/TaskTypeContext';

const PRESET_COLORS = [
  '#2563eb',
  '#ea580c',
  '#16a34a',
  '#8b5cf6',
  '#ef4444',
  '#06b6d4',
  '#ec4899',
  '#eab308',
];

const TaskTypeManager = () => {
  const { taskTypes, selectedTypeIds, toggleTypeFilter, addType, deleteType } =
    useTaskTypes();

  const [isAdding, setIsAdding] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeColor, setNewTypeColor] = useState('#2563eb');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    await addType(newTypeName.trim(), newTypeColor);
    setNewTypeName('');
    setIsAdding(false);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
          Мої календарі
        </span>
        <button
          onClick={() => setIsAdding((prev) => !prev)}
          className="p-1 rounded-md text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-[#252832] transition-colors"
          title="Додати категорію"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleAdd}
          className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#18191d] border border-gray-200 dark:border-[#2e303a] flex flex-col gap-2 mb-2 shadow-sm animate-scaleUp"
        >
          <input
            type="text"
            className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-[#1f2026] text-gray-900 dark:text-white border border-gray-300 dark:border-[#2e303a] focus:border-blue-500 focus:outline-none placeholder-gray-400"
            placeholder="Назва типу..."
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            autoFocus
          />

          <div className="flex items-center gap-1.5 flex-wrap">
            {PRESET_COLORS.map((col) => (
              <button
                type="button"
                key={col}
                className={`w-5 h-5 rounded-full transition-transform ${
                  newTypeColor === col ? 'ring-2 ring-white ring-offset-1 scale-110' : ''
                }`}
                style={{ backgroundColor: col }}
                onClick={() => setNewTypeColor(col)}
              />
            ))}
            <input
              type="color"
              className="w-5 h-5 rounded-full cursor-pointer bg-transparent border-0 p-0"
              value={newTypeColor}
              onChange={(e) => setNewTypeColor(e.target.value)}
              title="Довільний колір"
            />
          </div>

          <div className="flex items-center justify-end gap-1.5 mt-1">
            <button
              type="button"
              className="px-2 py-1 text-[11px] rounded-md text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setIsAdding(false)}
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="px-2.5 py-1 text-[11px] rounded-md bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors"
            >
              Зберегти
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-1">
        {taskTypes.map((type) => {
          const isChecked = selectedTypeIds.includes(type.id);

          return (
            <div
              key={type.id}
              className="group flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1f2026] transition-colors cursor-pointer"
              onClick={() => toggleTypeFilter(type.id)}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-4 h-4 rounded flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: isChecked ? type.color : 'transparent',
                    border: `1.5px solid ${type.color}`,
                  }}
                >
                  {isChecked && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                  {type.name}
                </span>
              </div>

              {taskTypes.length > 1 && (
                <button
                  type="button"
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-red-500 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteType(type.id);
                  }}
                  title="Видалити тип"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskTypeManager;
