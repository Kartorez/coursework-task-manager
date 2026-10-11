import { memo, useCallback, useState } from 'react';
import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';

const TaskCardWrapper = memo(({ task, onTaskClick }) => {
  const handleClick = useCallback(() => {
    onTaskClick(task);
  }, [task, onTaskClick]);

  return <TaskCard task={task} showStatus={false} onClick={handleClick} />;
});

const KanbanColumn = memo(
  ({
    id,
    title,
    color,
    tasks,
    onTaskClick,
    isDefault,
    onDelete,
    onColumnDragStart,
    onColumnDragEnd,
  }) => {
    const { setNodeRef, isOver } = useDroppable({ id: String(id) });
    const [isDraggingThisCol, setIsDraggingThisCol] = useState(false);

    return (
      <div
        ref={setNodeRef}
        className={`flex flex-col flex-shrink-0 w-80 max-h-full rounded-2xl bg-[#f1f3f5] dark:bg-[#18191d] border transition-all duration-200 p-3.5 shadow-sm ${
          isDraggingThisCol ? 'opacity-40 scale-98' : ''
        } ${
          isOver
            ? 'border-blue-500 bg-blue-50/40 dark:bg-[#1c1e24] ring-2 ring-blue-500/20'
            : 'border-gray-200 dark:border-[#262830]'
        }`}
      >
        <div
          draggable={true}
          onDragStart={(e) => {
            e.dataTransfer.setData('application/x-kanban-column', String(id));
            e.dataTransfer.effectAllowed = 'move';
            setIsDraggingThisCol(true);
            onColumnDragStart?.(id);
          }}
          onDragEnd={() => {
            setIsDraggingThisCol(false);
            onColumnDragEnd?.();
          }}
          className="flex items-center justify-between pb-3 mb-2 border-b border-gray-200/80 dark:border-[#24262d] cursor-grab active:cursor-grabbing select-none group/colheader"
          title="Перетягніть колонку, щоб змінити порядок"
        >
          <div className="flex items-center gap-2">
            <span
              className="text-gray-400 group-hover/colheader:text-blue-500 transition-colors"
              title="Перетягнути колонку"
            >
              ⠿
            </span>
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: color || '#3b82f6' }}
            />
            <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 tracking-wide">
              {title}
            </h3>
            <span className="ml-1.5 px-2 py-0.5 text-xs font-bold rounded-full bg-gray-200 dark:bg-[#242630] text-gray-700 dark:text-gray-400">
              {tasks.length}
            </span>
          </div>

          {!isDefault && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
              className="p-1 rounded-md text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs"
              title="Видалити колонку"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto pr-1 min-h-[120px]">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl border border-dashed border-gray-300 dark:border-[#2a2c35] text-gray-400 dark:text-gray-500">
              <span className="text-xl mb-1 opacity-70">📋</span>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Немає задач</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Перетягніть сюди задачу
              </p>
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
