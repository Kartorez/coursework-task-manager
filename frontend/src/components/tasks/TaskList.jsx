import { useMemo, useCallback, useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { useColumns } from '../../context/ColumnContext';
import TaskCard from '../kanban/TaskCard';
import Loader from '../Loader';
import FilterSelect from '../filters/FilterSelect';
import './TaskList.css';

const getSelectValue = (opt) =>
  opt && typeof opt === 'object' && 'value' in opt ? opt.value : opt || null;

const TaskList = () => {
  const { openModal } = useModal();
  const { user } = useAuth();
  const { tasks, setTasks, loading } = useTasks();
  const { columns } = useColumns();
  const [assigneeFilter, setAssigneeFilter] = useState(null);
  const [tagFilter, setTagFilter] = useState(null);
  const [columnFilter, setColumnFilter] = useState(null);

  const columnOptions = useMemo(
    () => columns.map((c) => ({ value: c.id, label: c.name })),
    [columns]
  );

  const assigneeOptions = useMemo(() => {
    const names = new Set();
    tasks.forEach((t) =>
      (t.assignees || []).forEach((a) => {
        if (a.username) names.add(a.username);
      })
    );
    return Array.from(names).map((n) => ({ value: n, label: n }));
  }, [tasks]);

  const tagOptions = useMemo(() => {
    const names = new Set();
    tasks.forEach((t) =>
      (t.tags || []).forEach((tag) => {
        if (tag.name) names.add(tag.name);
      })
    );
    return Array.from(names).map((n) => ({ value: n, label: n }));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const assigneeValue = getSelectValue(assigneeFilter);
    const tagValue = getSelectValue(tagFilter);
    const columnValue = getSelectValue(columnFilter);

    return tasks.filter((task) => {
      const matchAssignee = assigneeValue
        ? task.assignees?.some((a) => a.username === assigneeValue)
        : true;
      const matchTag = tagValue
        ? task.tags?.some((t) => t.name === tagValue)
        : true;
      const matchColumn = columnValue ? task.column_id === columnValue : true;

      return matchAssignee && matchTag && matchColumn;
    });
  }, [tasks, assigneeFilter, tagFilter, columnFilter]);

  const handleOpenTask = useCallback(
    (task) => {
      const isCreator =
        user?.id === task?.creator_id || user?.id === task?.creator?.id;
      openModal(isCreator ? 'edit' : 'view', { task });
    },
    [openModal, user]
  );

  const handleUpdateTask = useCallback(
    (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    },
    [setTasks]
  );

  if (loading) {
    return (
      <div className="loading-wrapper">
        <Loader size={60} />
      </div>
    );
  }

  return (
    <>
      <div className="task-list">
        <div className="task-list__header">
          <h2 className="task-list__title">
            Завдання: {filteredTasks.length} / {tasks.length}
          </h2>

          <div className="filters">
            <FilterSelect
              label="Колонка"
              value={columnFilter}
              onChange={setColumnFilter}
              defaultOptions={columnOptions}
              isMulti={false}
              isClearable={true}
            />
            <FilterSelect
              label="Виконавці"
              value={assigneeFilter}
              onChange={setAssigneeFilter}
              defaultOptions={assigneeOptions}
              isMulti={false}
              isClearable={true}
            />
            <FilterSelect
              label="Теги"
              value={tagFilter}
              onChange={setTagFilter}
              defaultOptions={tagOptions}
              isMulti={false}
              isClearable={true}
            />
          </div>
        </div>

        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const col = columns.find((c) => c.id === task.column_id);
            return (
              <TaskCard
                key={task.id}
                task={task}
                showStatus
                columnName={col?.name}
                columnColor={col?.color}
                onClick={() => handleOpenTask(task, handleUpdateTask)}
              />
            );
          })
        ) : (
          <p className="no-tasks">Немає задач</p>
        )}
      </div>

      <button className="add-task-fab" onClick={() => openModal('add')}>
        +
      </button>
    </>
  );
};

export default TaskList;
