import TaskCard from './TaskCard';
import './KanbanColumn.css';
import { useDroppable } from '@dnd-kit/core';

const KanbanColumn = ({ id, title, tasks, onTaskClick }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className={`kanban-column ${isOver ? 'kanban-column--active' : ''}`}
      ref={setNodeRef}
    >
      <div className="kanban-column__header">
        <h3
          className={`kanban-column__title ${title
            .toLowerCase()
            .replace(/\s/g, '-')}`}
        >
          {title}
        </h3>
        <span className="kanban-column__count">{tasks.length}</span>
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
            <TaskCard
              key={task.id}
              task={task}
              showStatus={false}
              onClick={() => onTaskClick(task)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
