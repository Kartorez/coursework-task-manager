import { useState, useRef, useEffect } from 'react';
import FilterSelect from '../filters/FilterSelect';
import './TaskFormFields.css';

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
    <div className="column-select" ref={ref}>
      <button
        type="button"
        className="column-select__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected?.name ?? 'Оберіть колонку'}</span>
        <svg
          className={`column-select__arrow ${open ? 'column-select__arrow--open' : ''}`}
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M3 5l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul className="column-select__dropdown" role="listbox">
          {columns.map((col) => (
            <li
              key={col.id}
              role="option"
              aria-selected={col.id === value}
              className={`column-select__option ${col.id === value ? 'column-select__option--active' : ''}`}
              onClick={() => {
                onChange(col.id);
                setOpen(false);
              }}
            >
              {col.name}
              {col.id === value && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2.5 7l3.5 3.5 5.5-6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
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
}) => (
  <>
    {!readOnly && columns.length > 0 && (
      <div className="form-group">
        <label className="form-label">Колонка</label>
        <ColumnSelect
          columns={columns}
          value={selectedColumnId}
          onChange={onColumnChange}
        />
      </div>
    )}

    <div className="form-group">
      <label htmlFor="title" className="form-label">
        Назва
      </label>
      <input
        type="text"
        id="title"
        className="form-input"
        {...register('title')}
        readOnly={readOnly}
      />
      {!readOnly && <p className="input-error">{errors.title?.message}</p>}
    </div>

    <div className="form-group">
      <label htmlFor="description" className="form-label">
        Опис
      </label>
      <textarea
        id="description"
        rows="4"
        className="form-input"
        {...register('description')}
        readOnly={readOnly}
      />
      {!readOnly && (
        <p className="input-error">{errors.description?.message}</p>
      )}
    </div>

    <div className="form-group">
      <label htmlFor="tags" className="form-label">
        Теги (через кому)
      </label>
      <input
        type="text"
        id="tags"
        className="form-input"
        {...register('tags')}
        readOnly={readOnly}
      />
    </div>

    <div className="form-group">
      <label htmlFor="assignees" className="form-label">
        Виконавці
      </label>
      {readOnly ? (
        <div className="readonly-field">
          {Array.isArray(task?.assignees) && task.assignees.length > 0 ? (
            task.assignees.map((a) => (
              <span key={a.id} className="readonly-chip">
                {a.username}
              </span>
            ))
          ) : (
            <span className="readonly-empty">Не призначено</span>
          )}
        </div>
      ) : (
        <FilterSelect
          classNamePrefix="filter-select"
          className="full"
          placeholder="Введіть ім'я..."
          loadOptions={loadAssigneeOptions}
          defaultOptions={assigneeOptions}
          value={assigneeValue}
          onChange={onAssigneeChange}
          isMulti
        />
      )}
    </div>
  </>
);

export default TaskFormFields;
