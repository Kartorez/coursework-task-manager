import { memo, useCallback } from 'react';
import TaskCard from './TaskCard';
import './KanbanColumn.css';
import { useDroppable } from '@dnd-kit/core';

const TaskCardWrapper = memo(({ task, onTaskClick }) => {
  const handleClick = useCallback(() => {
    onTaskClick(task);
  }, [task, onTaskClick]);

  return <TaskCard task={task} showStatus={false} onClick={handleClick} />;
});

const KanbanColumn = memo(
  ({ id, title, color, tasks, onTaskClick, isDefault, onDelete }) => {
    const { setNodeRef, isOver } = useDroppable({ id: String(id) });

    return (
      <div
        className={`kanban-column ${isOver ? 'kanban-column--active' : ''}`}
        ref={setNodeRef}
      >
        <div className="kanban-column__header">
          <div className="kanban-column__header-left">
            <span
              className="kanban-column__color-dot"
              style={{ backgroundColor: color || '#6366f1' }}
            />
            <h3 className="kanban-column__title">{title}</h3>
            <span className="kanban-column__count">{tasks.length}</span>
          </div>

          {!isDefault && (
            <button
              className="kanban-column__delete"
              onClick={() => onDelete(id)}
              title="Видалити колонку"
            >
              ✕
            </button>
          )}
        </div>

        <div className="kanban-column__body">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">✨</span>
              <p className="empty-title">Немає задач</p>
              <p className="empty-sub">Створіть нову або перетягніть сюди.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCardWrapper
                key={task.id}
                task={task}
                onTaskClick={onTaskClick}
              />
            ))
          )}
        </div>
      </div>
    );
  }
);

export default KanbanColumn;
