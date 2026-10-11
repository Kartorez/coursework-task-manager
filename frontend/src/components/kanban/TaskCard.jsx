import { useDraggable } from '@dnd-kit/core';
import { memo } from 'react';

const formatCardDate = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return 'Сьогодні';
  }
  return date.toLocaleDateString('uk-UA', {
    day: 'numeric',
    month: 'short',
  });
};

const TaskCard = memo(
  ({
    task,
    isOverlay = false,
    onClick,
    showStatus = false,
    columnName,
    columnColor,
  }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
      id: task.id,
      data: { task },
      disabled: isOverlay,
    });

    const style = {
      zIndex: isOverlay ? 9999 : 1,
      cursor: isDragging ? 'grabbing' : 'pointer',
      opacity: isDragging && !isOverlay ? 0 : 1,
      pointerEvents: isDragging && !isOverlay ? 'none' : undefined,
      userSelect: 'none',
    };

    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        onClick={() => !isDragging && onClick?.(task)}
        className={`group relative flex flex-col p-3.5 rounded-xl bg-white dark:bg-[#1f2128] hover:bg-gray-50/80 dark:hover:bg-[#252832] border border-gray-200/90 dark:border-[#2d303b] hover:border-blue-500/50 shadow-sm transition-all duration-200 ${
          isOverlay ? 'shadow-2xl shadow-black/40 scale-102 border-blue-500' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-white line-clamp-2 leading-snug">
            {task.title}
          </h4>

          {showStatus && columnName && (
            <span
              className="px-2 py-0.5 text-[11px] font-medium rounded-md whitespace-nowrap"
              style={{
                backgroundColor: columnColor ? `${columnColor}18` : 'rgba(0,0,0,0.06)',
                color: columnColor || '#6b7280',
              }}
            >
              {columnName}
            </span>
          )}
        </div>

        {task.taskType && (
          <div className="mb-2">
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold"
              style={{
                backgroundColor: `${task.taskType.color}18`,
                color: task.taskType.color,
                border: `1px solid ${task.taskType.color}35`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: task.taskType.color }}
              />
              {task.taskType.name}
            </span>
          </div>
        )}

        {task.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2.5 leading-relaxed">
            {task.description}
          </p>
        )}

        {(task.date || task.start_time) && (
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#282a35] px-2.5 py-1 rounded-lg border border-gray-200/80 dark:border-[#353846] w-fit mb-2.5">
            <svg
              className="w-3.5 h-3.5 text-blue-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {task.date && formatCardDate(task.date)}
              {task.date && task.start_time && ' • '}
              {task.start_time &&
                (task.end_time ? `${task.start_time}–${task.end_time}` : task.start_time)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-[#2a2c35]">
          <div className="flex items-center gap-1.5 flex-wrap">
            {task.tags?.map((tag, i) => {
              const tagName = typeof tag === 'object' ? tag.name : tag;
              return (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/10 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                >
                  {tagName}
                </span>
              );
            })}
          </div>

          <div className="flex items-center -space-x-1.5">
            {task.assignees?.length > 0 ? (
              task.assignees.map((assignee, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-blue-600/20 dark:bg-blue-600/30 border border-blue-500/30 text-blue-600 dark:text-blue-300 text-[11px] font-bold flex items-center justify-center uppercase"
                  title={assignee.username || assignee}
                >
                  {assignee.username ? assignee.username[0] : assignee[0]}
                </div>
              ))
            ) : (
              <div
                className="w-6 h-6 rounded-full bg-gray-100 dark:bg-[#2a2c36] border border-gray-200 dark:border-[#373946] text-gray-600 dark:text-gray-400 text-[11px] font-bold flex items-center justify-center uppercase"
                title={task.creator?.username || 'Користувач'}
              >
                {task.creator?.username?.[0] || 'U'}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default TaskCard;
