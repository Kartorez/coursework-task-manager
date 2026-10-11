import { useState, useRef, useEffect } from 'react';
import FilterSelect from '../filters/FilterSelect';
import { useTaskTypes } from '../../context/TaskTypeContext';
import { useTeam } from '../../context/TeamContext';

const ColumnSelect = ({ columns, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = columns.find((c) => c.id === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        className="w-full flex items-center justify-between px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-[#1f2026] text-gray-900 dark:text-white border border-gray-300 dark:border-[#2e303a] hover:border-gray-400 dark:hover:border-[#3e414e] transition-colors focus:border-blue-500 focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="font-medium">{selected?.name ?? 'Оберіть колонку'}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <ul className="absolute left-0 right-0 top-full mt-1.5 p-1 rounded-xl bg-white dark:bg-[#18191d] border border-gray-200 dark:border-[#2e303a] shadow-2xl z-50 max-h-48 overflow-y-auto">
          {columns.map((col) => (
            <li
              key={col.id}
              className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors ${
                col.id === value
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#23252d] hover:text-gray-900 dark:hover:text-white'
              }`}
              onClick={() => {
                onChange(col.id);
                setOpen(false);
              }}
            >
              <span>{col.name}</span>
              {col.id === value && <span>✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const TaskFormFields = ({
  register,
  errors,
  readOnly = false,
  assigneeOptions = [],
  assigneeValue = [],
  onAssigneeChange,
  loadAssigneeOptions,
  task,
  columns = [],
  selectedColumnId,
  onColumnChange,
  selectedTypeId,
  onTypeChange,
}) => {
  const { taskTypes } = useTaskTypes();
  const { activeTeam, openTeamModal } = useTeam();

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-700 dark:text-gray-400">
          Тип задачі (Категорія)
        </label>
        {readOnly ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#1f2026] border border-gray-200 dark:border-[#2e303a]">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: task?.taskType?.color || '#3b82f6' }}
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {task?.taskType?.name || 'Загальне'}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {taskTypes.map((type) => {
              const active = selectedTypeId === type.id;
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => onTypeChange?.(type.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all ${
                    active
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/30'
                      : 'border-gray-200 dark:border-[#2e303a] hover:bg-gray-100 dark:hover:bg-[#1f2026] text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="truncate">{type.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {!readOnly && columns.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-400">
            Колонка
          </label>
          <ColumnSelect
            columns={columns}
            value={selectedColumnId}
            onChange={onColumnChange}
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-xs font-semibold text-gray-700 dark:text-gray-400">
          Назва
        </label>
        <input
          type="text"
          id="title"
          className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-[#1f2026] text-gray-900 dark:text-white border border-gray-300 dark:border-[#2e303a] focus:border-blue-500 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors disabled:opacity-70"
          placeholder="Стендап, дизайн, розробка..."
          {...register('title')}
          readOnly={readOnly}
        />
        {!readOnly && errors.title && (
          <p className="text-xs text-red-500 pl-1">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="date" className="text-xs font-semibold text-gray-700 dark:text-gray-400">
            Дата (для календаря)
          </label>
          <input
            type="date"
            id="date"
            className="w-full px-3 py-1.5 text-xs rounded-xl bg-gray-50 dark:bg-[#1f2026] text-gray-900 dark:text-white border border-gray-300 dark:border-[#2e303a] focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-70"
            {...register('date')}
            readOnly={readOnly}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="start_time" className="text-xs font-semibold text-gray-700 dark:text-gray-400">
            Початок
          </label>
          <input
            type="time"
            id="start_time"
            className="w-full px-3 py-1.5 text-xs rounded-xl bg-gray-50 dark:bg-[#1f2026] text-gray-900 dark:text-white border border-gray-300 dark:border-[#2e303a] focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-70"
            {...register('start_time')}
            readOnly={readOnly}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="end_time" className="text-xs font-semibold text-gray-700 dark:text-gray-400">
            Кінець
          </label>
          <input
            type="time"
            id="end_time"
            className="w-full px-3 py-1.5 text-xs rounded-xl bg-gray-50 dark:bg-[#1f2026] text-gray-900 dark:text-white border border-gray-300 dark:border-[#2e303a] focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-70"
            {...register('end_time')}
            readOnly={readOnly}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-xs font-semibold text-gray-700 dark:text-gray-400">
          Опис
        </label>
        <textarea
          id="description"
          rows="3"
          className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-[#1f2026] text-gray-900 dark:text-white border border-gray-300 dark:border-[#2e303a] focus:border-blue-500 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors disabled:opacity-70 resize-none"
          placeholder="Деталі або опис задачі..."
          {...register('description')}
          readOnly={readOnly}
        />
        {!readOnly && errors.description && (
          <p className="text-xs text-red-500 pl-1">{errors.description.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="tags" className="text-xs font-semibold text-gray-700 dark:text-gray-400">
          Теги (через кому)
        </label>
        <input
          type="text"
          id="tags"
          className="w-full px-3.5 py-2 text-sm rounded-xl bg-gray-50 dark:bg-[#1f2026] text-gray-900 dark:text-white border border-gray-300 dark:border-[#2e303a] focus:border-blue-500 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-colors disabled:opacity-70"
          placeholder="Терміново, Планування..."
          {...register('tags')}
          readOnly={readOnly}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="assignees" className="text-xs font-semibold text-gray-700 dark:text-gray-400">
            Виконавці {activeTeam && <span className="font-normal text-blue-500">({activeTeam.name})</span>}
          </label>
          <button
            type="button"
            onClick={openTeamModal}
            className="text-[11px] text-blue-500 hover:text-blue-600 transition-colors"
          >
            {activeTeam ? '👥 Керувати командою' : '👥 Створити команду'}
          </button>
        </div>
        {!readOnly && !activeTeam && (
          <p className="text-[11px] text-gray-400 dark:text-gray-500 -mt-0.5">
            💡 Ви бачите тільки себе. Щоб призначати завдання колегам, створіть або приєднайтеся до команди.
          </p>
        )}
        {readOnly ? (
          <div className="flex items-center gap-2 flex-wrap min-h-[38px] p-2 rounded-xl bg-gray-50 dark:bg-[#1f2026] border border-gray-200 dark:border-[#2e303a]">
            {Array.isArray(task?.assignees) && task.assignees.length > 0 ? (
              task.assignees.map((a) => (
                <span
                  key={a.id}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                >
                  {a.username}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">Не призначено</span>
            )}
          </div>
        ) : (
          <FilterSelect
            className="w-full"
            placeholder="Пошук учасника команди..."
            loadOptions={loadAssigneeOptions}
            defaultOptions={assigneeOptions}
            value={assigneeValue}
            onChange={onAssigneeChange}
            isMulti
          />
        )}
      </div>
    </div>
  );
};

export default TaskFormFields;
