import { useState, useCallback, useMemo } from 'react';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import Loader from '../Loader';
import './KanbanBoard.css';
import { useModal } from '../../context/ModalContext';
import { useTasks } from '../../context/TaskContext';
import { useColumns } from '../../context/ColumnContext';
import AddColumn from './AddColumn';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { taskService } from '../../api/taskService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const KanbanBoard = () => {
  const { tasks, setTasks, loading: tasksLoading } = useTasks();
  const {
    columns,
    loading: columnsLoading,
    addColumn,
    removeColumn,
  } = useColumns();
  const { openModal } = useModal();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { tolerance: 5, delay: 250 },
    })
  );

  const tasksByColumn = useMemo(() => {
    const map = {};
    for (const col of columns) {
      map[col.id] = [];
    }
    for (const task of tasks) {
      if (task.column_id && map[task.column_id]) {
        map[task.column_id].push(task);
      }
    }
    return map;
  }, [tasks, columns]);

  const handleDragStart = useCallback((event) => {
    const dragged = event.active.data.current?.task;

    if (dragged) {
      setActiveTask({
        ...dragged,
        creator_id: dragged.creator_id ?? dragged.creator?.id ?? null,
      });
    }

    document.body.style.overflow = 'hidden';
  }, []);

  const handleDragEnd = useCallback(
    async (event) => {
      document.body.style.overflow = '';
      const { active, over } = event;
      setActiveTask(null);
      if (!over) return;

      const taskId = active.id;
      const columnId = Number(over.id);
      let prevColumnId = null;

      setTasks((prev) => {
        const prevTask = prev.find((t) => t.id === taskId);
        if (!prevTask || prevTask.column_id === columnId) return prev;
        prevColumnId = prevTask.column_id;
        return prev.map((t) =>
          t.id === taskId ? { ...t, column_id: columnId } : t
        );
      });

      await Promise.resolve();
      if (prevColumnId === null) return;

      try {
        await taskService.changeColumn(taskId, columnId);
        showToast('Колонку змінено', 'success');
      } catch {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, column_id: prevColumnId } : t
          )
        );
        showToast('Не вдалось змінити колонку', 'error');
      }
    },
    [setTasks, showToast]
  );

  const handleDragCancel = useCallback(() => {
    document.body.style.overflow = '';
    setActiveTask(null);
  }, []);

  const handleOpenTask = useCallback(
    (task) => {
      if (!user || !task) return;
      const isCreator =
        Number(user.id) === Number(task.creator_id ?? task.creator?.id ?? null);
      openModal(isCreator ? 'edit' : 'view', { task });
    },
    [openModal, user]
  );

  const handleRemoveColumn = useCallback(
    async (id) => {
      try {
        await removeColumn(id);
        showToast('Колонку видалено', 'success');
      } catch {
        showToast('Не вдалось видалити колонку', 'error');
      }
    },
    [removeColumn, showToast]
  );

  const handleAddColumn = useCallback(
    async (name) => {
      try {
        await addColumn(name, '#6366f1');
        showToast('Колонку створено', 'success');
      } catch {
        showToast('Не вдалось створити колонку', 'error');
      }
    },
    [addColumn, showToast]
  );

  const loading = tasksLoading || columnsLoading;

  return (
    <div className="kanban-board fade-in-out">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        modifiers={[restrictToWindowEdges]}
      >
        {loading ? (
          <div className="loading-wrapper fade-in-out">
            <Loader size={70} />
          </div>
        ) : (
          <>
            {columns.map((col) => (
              <KanbanColumn
                key={col.id}
                id={String(col.id)}
                title={col.name}
                color={col.color}
                isDefault={col.is_default}
                tasks={tasksByColumn[col.id] || []}
                onTaskClick={handleOpenTask}
                onDelete={handleRemoveColumn}
              />
            ))}
          </>
        )}

        <DragOverlay adjustScale={false} dropAnimation={null}>
          {activeTask && (
            <TaskCard
              task={activeTask}
              isOverlay
              onClick={() => handleOpenTask(activeTask)}
            />
          )}
        </DragOverlay>
      </DndContext>

      <AddColumn onAdd={handleAddColumn} />
    </div>
  );
};

export default KanbanBoard;
