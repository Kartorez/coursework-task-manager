import { useMemo, useState } from 'react';

const HOURS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
];

const WEEKDAY_NAMES = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'НД'];

const getWeekDates = (currentDate) => {
  const d = new Date(currentDate);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));

  const week = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(monday);
    nextDay.setDate(monday.getDate() + i);
    week.push(nextDay);
  }
  return week;
};

const timeToMinutesFromStart = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  const total = h * 60 + (m || 0);
  const start = 8 * 60;
  return Math.max(0, total - start);
};

const getHalfHourTime = (hourStr) => {
  const [h] = hourStr.split(':');
  return `${h}:30`;
};

const CalendarGrid = ({
  currentDate,
  tasks = [],
  onTaskClick,
  onSlotClick,
  onTaskDrop,
}) => {
  const [dragOverSlot, setDragOverSlot] = useState(null);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);
  const today = new Date();

  const formatDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const isToday = (date) =>
    today.getDate() === date.getDate() &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear();

  const nowHours = today.getHours();
  const nowMinutes = today.getMinutes();
  const nowTotalMinutes = nowHours * 60 + nowMinutes;
  const startMinutes = 8 * 60;
  const isCurrentWeek = weekDates.some((d) => isToday(d));
  const showCurrentTimeLine =
    isCurrentWeek &&
    nowTotalMinutes >= startMinutes &&
    nowTotalMinutes <= 22 * 60;
  const currentTimeTopPx =
    ((nowTotalMinutes - startMinutes) / 60) * 64;

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-white dark:bg-[#131417] overflow-y-auto overflow-x-auto select-none transition-colors">
      <div className="min-w-[750px] flex-1 flex flex-col">
        <div className="sticky top-0 z-20 grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-200 dark:border-[#24262d] bg-white/95 dark:bg-[#131417]/95 backdrop-blur-md">
          <div className="p-2 border-r border-gray-200 dark:border-[#24262d]" />
          {weekDates.map((date, idx) => {
            const todayMatch = isToday(date);
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center py-3 border-r border-gray-200 dark:border-[#24262d] last:border-r-0"
              >
                <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  {WEEKDAY_NAMES[idx]}
                </span>
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-transform ${
                    todayMatch
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105'
                      : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-[#1f2026]'
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative grid grid-cols-[60px_repeat(7,1fr)] flex-1 pb-8">
          {showCurrentTimeLine && (
            <div
              className="absolute left-[60px] right-0 z-10 flex items-center pointer-events-none"
              style={{ top: `${currentTimeTopPx}px` }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-1.5 shadow-sm" />
              <div className="flex-1 h-[2px] bg-red-500 opacity-80" />
            </div>
          )}

          <div className="flex flex-col border-r border-gray-200 dark:border-[#24262d]">
            {HOURS.map((hour, idx) => (
              <div
                key={hour}
                className={`h-16 pr-2.5 text-right text-[11px] font-medium text-gray-400 dark:text-gray-500 ${
                  idx === 0 ? 'pt-1' : '-mt-2.5'
                }`}
              >
                {hour}
              </div>
            ))}
          </div>

          {weekDates.map((date, colIdx) => {
            const dateKey = formatDateKey(date);
            const dayTasks = tasks.filter((t) => t.date === dateKey && t.start_time);

            return (
              <div
                key={colIdx}
                className="relative border-r border-gray-200 dark:border-[#24262d] last:border-r-0"
              >
                {HOURS.map((hour, hourIdx) => {
                  const halfHour = getHalfHourTime(hour);
                  const isHoveredHour =
                    dragOverSlot?.date === dateKey && dragOverSlot?.time === hour;
                  const isHoveredHalf =
                    dragOverSlot?.date === dateKey && dragOverSlot?.time === halfHour;

                  return (
                    <div
                      key={hour}
                      className={`h-16 border-b border-gray-100 dark:border-[#1f2128] transition-colors relative flex flex-col ${
                        hourIdx === 0 ? 'border-t border-gray-100 dark:border-[#1f2128]' : ''
                      }`}
                    >
                      <div
                        className={`flex-1 h-8 transition-colors cursor-pointer relative border-b border-dashed border-gray-100/70 dark:border-[#1f2128]/70 ${
                          isHoveredHour
                            ? 'bg-blue-500/20 dark:bg-blue-500/30'
                            : 'hover:bg-blue-50/25 dark:hover:bg-blue-500/5'
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                          if (
                            dragOverSlot?.date !== dateKey ||
                            dragOverSlot?.time !== hour
                          ) {
                            setDragOverSlot({ date: dateKey, time: hour });
                          }
                        }}
                        onDragLeave={() => {
                          if (
                            dragOverSlot?.date === dateKey &&
                            dragOverSlot?.time === hour
                          ) {
                            setDragOverSlot(null);
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOverSlot(null);
                          const taskId =
                            e.dataTransfer.getData('text/plain') ||
                            e.dataTransfer.getData('application/json');
                          if (taskId) {
                            onTaskDrop?.(taskId, dateKey, hour);
                          }
                        }}
                        onClick={() => onSlotClick?.(dateKey, hour)}
                        title={`Створити подію о ${hour}`}
                      >
                        {isHoveredHour && (
                          <div className="absolute inset-0.5 rounded border border-dashed border-blue-500 bg-blue-500/10 pointer-events-none flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400 z-20">
                            {hour}
                          </div>
                        )}
                      </div>

                      <div
                        className={`flex-1 h-8 transition-colors cursor-pointer relative ${
                          isHoveredHalf
                            ? 'bg-blue-500/20 dark:bg-blue-500/30'
                            : 'hover:bg-blue-50/25 dark:hover:bg-blue-500/5'
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.dataTransfer.dropEffect = 'move';
                          if (
                            dragOverSlot?.date !== dateKey ||
                            dragOverSlot?.time !== halfHour
                          ) {
                            setDragOverSlot({ date: dateKey, time: halfHour });
                          }
                        }}
                        onDragLeave={() => {
                          if (
                            dragOverSlot?.date === dateKey &&
                            dragOverSlot?.time === halfHour
                          ) {
                            setDragOverSlot(null);
                          }
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOverSlot(null);
                          const taskId =
                            e.dataTransfer.getData('text/plain') ||
                            e.dataTransfer.getData('application/json');
                          if (taskId) {
                            onTaskDrop?.(taskId, dateKey, halfHour);
                          }
                        }}
                        onClick={() => onSlotClick?.(dateKey, halfHour)}
                        title={`Створити подію о ${halfHour}`}
                      >
                        {isHoveredHalf && (
                          <div className="absolute inset-0.5 rounded border border-dashed border-blue-500 bg-blue-500/10 pointer-events-none flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400 z-20">
                            {halfHour}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {dayTasks.map((task) => {
                  const startMins = timeToMinutesFromStart(task.start_time);
                  let endMins = task.end_time
                    ? timeToMinutesFromStart(task.end_time)
                    : startMins + 60;
                  if (endMins <= startMins) endMins = startMins + 30;

                  const topPx = (startMins / 60) * 64;
                  const heightPx = Math.max(26, ((endMins - startMins) / 60) * 64);
                  const bgCol = task.taskType?.color || '#2563eb';
                  const isBeingDragged = String(draggedTaskId) === String(task.id);

                  return (
                    <div
                      key={task.id}
                      draggable={true}
                      onDragStart={(e) => {
                        e.stopPropagation();
                        e.dataTransfer.setData('text/plain', String(task.id));
                        e.dataTransfer.setData('application/json', String(task.id));
                        e.dataTransfer.effectAllowed = 'move';
                        setDraggedTaskId(task.id);
                      }}
                      onDragEnd={() => {
                        setDraggedTaskId(null);
                        setDragOverSlot(null);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick?.(task);
                      }}
                      style={{
                        top: `${topPx}px`,
                        height: `${heightPx}px`,
                        backgroundColor: bgCol,
                        opacity: isBeingDragged ? 0.35 : 1,
                      }}
                      className="absolute left-1 right-1 rounded-lg p-2 text-white shadow-md hover:brightness-110 cursor-grab active:cursor-grabbing overflow-hidden transition-all z-10 flex flex-col justify-between select-none"
                    >
                      <div>
                        <h4 className="text-xs font-bold leading-tight line-clamp-1">
                          {task.title}
                        </h4>
                        <span className="text-[10px] opacity-90 font-medium">
                          {task.start_time}–{task.end_time || ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
