import { useState, useMemo } from 'react';
import MiniCalendar from './MiniCalendar';
import TaskTypeManager from './TaskTypeManager';
import BacklogList from './BacklogList';
import CalendarGrid from './CalendarGrid';
import { useTasks } from '../../context/TaskContext';
import { useTaskTypes } from '../../context/TaskTypeContext';
import { useModal } from '../../context/ModalContext';
import { taskService } from '../../api/taskService';
const calculateEndTime = (startTimeStr, durationMinutes = 60) => {
  if (!startTimeStr) return '09:00';
  const [h, m] = startTimeStr.split(':').map(Number);
  const totalMins = h * 60 + (m || 0) + durationMinutes;
  const newH = Math.min(23, Math.floor(totalMins / 60));
  const newM = totalMins % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
};

const getTaskDurationMinutes = (task) => {
  if (task.start_time && task.end_time) {
    const [sh, sm] = task.start_time.split(':').map(Number);
    const [eh, em] = task.end_time.split(':').map(Number);
    const diff = (eh * 60 + (em || 0)) - (sh * 60 + (sm || 0));
    if (diff > 0) return diff;
  }
  if (!task.duration) return 60;
  if (task.duration.includes('30')) return 30;
  if (task.duration.includes('2')) return 120;
  if (task.duration.includes('3')) return 180;
  if (task.duration.includes('4')) return 240;
  return 60;
};

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { tasks, setTasks } = useTasks();
  const { selectedTypeIds } = useTaskTypes();
  const { openModal } = useModal();

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (task.task_type_id) {
        return selectedTypeIds.includes(task.task_type_id);
      }
      return true;
    });
  }, [tasks, selectedTypeIds]);

  const backlogTasks = useMemo(() => {
    return visibleTasks.filter((t) => !t.date || !t.start_time);
  }, [visibleTasks]);

  const handleTaskClick = (task) => {
    setIsSidebarOpen(false);
    openModal('edit', { task });
  };

  const handleSlotClick = (dateStr, hourStr) => {
    openModal('add', {
      initialDate: dateStr,
      initialStartTime: hourStr,
    });
  };

  const handleTaskSchedule = async (taskId, targetDate, targetHour) => {
    const task = tasks.find((t) => String(t.id) === String(taskId));
    if (!task) return;

    const durationMinutes = getTaskDurationMinutes(task);
    const newEndTime = calculateEndTime(targetHour, durationMinutes);

    const updatedTask = {
      ...task,
      date: targetDate,
      start_time: targetHour,
      end_time: newEndTime,
    };

    setTasks((prev) =>
      prev.map((t) => (String(t.id) === String(taskId) ? updatedTask : t))
    );

    try {
      await taskService.update(task.id, {
        date: targetDate,
        start_time: targetHour,
        end_time: newEndTime,
      });
    } catch {
      setTasks((prev) =>
        prev.map((t) => (String(t.id) === String(taskId) ? task : t))
      );
    }
  };

  const handleTaskUnschedule = async (taskId) => {
    const task = tasks.find((t) => String(t.id) === String(taskId));
    if (!task) return;

    const updatedTask = {
      ...task,
      date: null,
      start_time: null,
      end_time: null,
    };

    setTasks((prev) =>
      prev.map((t) => (String(t.id) === String(taskId) ? updatedTask : t))
    );

    try {
      await taskService.update(task.id, {
        date: null,
        start_time: null,
        end_time: null,
      });
    } catch {
      setTasks((prev) =>
        prev.map((t) => (String(t.id) === String(taskId) ? task : t))
      );
    }
  };

  return (
    <div className="relative flex-1 flex flex-col lg:flex-row h-full min-h-0 overflow-hidden bg-[#f8f9fa] dark:bg-[#131417] transition-colors">
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white dark:bg-[#131417] p-4 flex flex-col gap-5 overflow-y-auto shadow-2xl transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0 lg:w-72 lg:h-full lg:border-r lg:border-gray-200 lg:dark:border-[#24262d] lg:z-auto lg:shadow-none lg:flex-shrink-0
        `}
      >
        <div className="lg:hidden flex items-center justify-between pb-3 border-b border-gray-200 dark:border-[#24262d]">
          <span className="font-bold text-sm text-gray-900 dark:text-white">
            Календар та беклог
          </span>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1f2026] text-sm"
            aria-label="Закрити"
          >
            ✕
          </button>
        </div>

        <button
          onClick={() => {
            setIsSidebarOpen(false);
            openModal('add');
          }}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-[#1f2026] dark:hover:bg-[#282a32] border border-gray-200 dark:border-[#2e303a] text-gray-900 dark:text-white font-semibold text-sm shadow-sm transition-all group"
        >
          <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-base group-hover:scale-105 transition-transform">
            +
          </div>
          <span>Створити</span>
        </button>

        <div className="pb-4 border-b border-gray-200 dark:border-[#24262d]">
          <MiniCalendar
            selectedDate={currentDate}
            onSelectDate={(newDate) => {
              setCurrentDate(newDate);
              setIsSidebarOpen(false);
            }}
          />
        </div>

        <div className="pb-4 border-b border-gray-200 dark:border-[#24262d]">
          <TaskTypeManager />
        </div>

        <div className="flex-1">
          <BacklogList
            tasks={backlogTasks}
            onTaskClick={handleTaskClick}
            onDropToBacklog={handleTaskUnschedule}
          />
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 min-h-0 h-full overflow-hidden">
        <div className="lg:hidden flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-[#24262d] bg-white/90 dark:bg-[#131417]/90 backdrop-blur-md flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#1f2026] dark:hover:bg-[#282a32] border border-gray-200 dark:border-[#2e303a] text-xs font-semibold text-gray-800 dark:text-gray-200 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <span>Беклог та фільтри</span>
            {backlogTasks.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                {backlogTasks.length}
              </span>
            )}
          </button>
        </div>

        <CalendarGrid
          currentDate={currentDate}
          tasks={visibleTasks}
          onTaskClick={handleTaskClick}
          onSlotClick={handleSlotClick}
          onTaskDrop={handleTaskSchedule}
        />
      </main>
    </div>
  );
};

export default CalendarView;
