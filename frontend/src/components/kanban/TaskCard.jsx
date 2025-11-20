import { useDraggable } from '@dnd-kit/core';
import './TaskCard.css';

const TaskCard = ({ task, isOverlay = false, onClick, showStatus = false }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: isOverlay ? 'none' : 'transform 0.2s ease',
    zIndex: isDragging || isOverlay ? 9999 : 1,
    cursor: 'pointer',
    opacity: isDragging && !isOverlay ? 0 : 1,
    scale: isOverlay ? 1.05 : 1,
    boxShadow: isOverlay
      ? '0 10px 25px rgba(0, 0, 0, 0.35)'
      : '0 4px 10px rgba(0, 0, 0, 0.2)',
    userSelect: 'none',
  };

  const STATUS_LABELS = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    done: 'Done',
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="task-card"
      onClick={() => !isDragging && onClick?.(task)}
    >
      <div className="task-body">
        <div className="task-body__text">
          <h3 className="task-card__title">{task.title}</h3>
          <p className="task-card__description">{task.description}</p>
        </div>
        {showStatus && (
          <div
            className={`task-card__status ${STATUS_LABELS[task.status]
              .toLowerCase()
              .replace(' ', '-')}`}
          >
            {STATUS_LABELS[task.status]}
          </div>
        )}
      </div>
      <div className="task-card__footer">
        <ul className="task-card__tags">
          {task.tags?.map((tag, i) => (
            <li key={i} className="task-card__tag">
              {typeof tag === 'object' ? tag.name : tag}
            </li>
          ))}
        </ul>
        <ul className="task-card__assigneed">
          {task.assignees?.length > 0 ? (
            task.assignees.map((assignee, i) => (
              <li key={i} className="task-card__assigneed-avatar">
                {assignee.username
                  ? assignee.username[0].toUpperCase()
                  : assignee[0]?.toUpperCase()}
              </li>
            ))
          ) : (
            <li className="task-card__assigneed-avatar empty">
              {task.creator?.username?.[0]?.toUpperCase() || 'A'}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TaskCard;
