import { memo, useState } from 'react';

const BacklogList = memo(({ tasks, onTaskClick, onDropToBacklog }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      className={`w-full flex flex-col gap-2 p-1.5 rounded-2xl transition-all ${
        isDragOver
          ? 'bg-blue-500/10 ring-2 ring-blue-500/40'
          : ''
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const taskId =
          e.dataTransfer.getData('text/plain') ||
          e.dataTransfer.getData('application/json');
        if (taskId) {
          onDropToBacklog?.(taskId);
        }
      }}
    >
      <div className="flex flex-col gap-0.5 px-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
            Беклог
          </span>
          {tasks.length > 0 && (
            <span className="text-[10px] font-semibold text-gray-400">
              {tasks.length}
            </span>
          )}
        </div>
        <span className="text-[11px] text-gray-500 leading-tight">
          Перетягни картку на час у календарі.
        </span>
      </div>

      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <div className="p-3 rounded-xl border border-dashed border-gray-300 dark:border-[#2e303a] text-center text-[11px] text-gray-400">
            {isDragOver
              ? 'Відпустіть задачу, щоб додати у беклог'
              : 'Немає задач у беклозі'}
          </div>
        ) : (
          tasks.map((task) => {
            const typeColor = task.taskType?.color || '#3b82f6';
            const typeName = task.taskType?.name || 'Фокус';
            const duration = task.duration || '1 год';

            return (
              <div
                key={task.id}
                draggable={true}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', String(task.id));
                  e.dataTransfer.setData('application/json', String(task.id));
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onClick={() => onTaskClick?.(task)}
                className="group relative flex flex-col p-2.5 rounded-xl bg-white dark:bg-[#1f2026] hover:bg-gray-50 dark:hover:bg-[#252832] border border-gray-200 dark:border-[#2d303b] hover:border-blue-500/40 shadow-sm transition-all cursor-grab active:cursor-grabbing select-none overflow-hidden"
                title="Перетягніть на календар, щоб призначити час"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l"
                  style={{ backgroundColor: typeColor }}
                />

                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-white line-clamp-1 pl-1.5">
                  {task.title}
                </span>

                <div className="flex items-center justify-between text-[11px] text-gray-500 pl-1.5 mt-1">
                  <span>{typeName}</span>
                  <span className="text-gray-400">{duration}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

export default BacklogList;
