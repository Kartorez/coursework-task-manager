import FilterSelect from '../filters/FilterSelect';
import './TaskFormFields.css';

const TaskFormFields = ({
  register,
  errors,
  readOnly = false,
  assigneeOptions = [],
  assigneeValue = [],
  onAssigneeChange,
  loadAssigneeOptions,
  task,
}) => (
  <>
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
          placeholder="Введіть ім’я..."
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
