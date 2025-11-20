import { useState, useCallback } from 'react';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import Loader from '../Loader';
import './KanbanBoard.css';
import { useModal } from '../../context/ModalContext';
import { useTasks } from '../../context/TaskContext';
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
  const { tasks, setTasks, loading } = useTasks();
  const { openModal } = useModal();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { tolerance: 5 } })
  );

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'done', title: 'Done' },
  ];

  const handleDragStart = useCallback(
    (event) => {
      const dragged = tasks.find((t) => t.id === event.active.id);
      if (!dragged) return;

      setActiveTask({
        ...dragged,
        creator_id: dragged.creator_id ?? dragged.creator?.id ?? null,
      });
    },
    [tasks]
  );

  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;
      if (!over) return;
      const newStatus = over.id;

      setTasks((prev) =>
        prev.map((task) =>
          task.id === active.id ? { ...task, status: newStatus } : task
        )
      );

      setActiveTask(null);

      try {
        await taskService.changeStatus(active.id, newStatus);
        showToast('Статус успішно змінений', 'success');
      } catch (err) {
        showToast('Не вдалось змінити статус', 'error');
      }
    },
    [setTasks, showToast]
  );

  const handleOpenTask = useCallback(
    (task, onSave) => {
      if (!user || !task) return;

      const isCreator =
        Number(user.id) === Number(task.creator_id ?? task.creator?.id ?? null);

      openModal(isCreator ? 'edit' : 'view', { task, onSave });
    },
    [openModal, user]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      {loading ? (
        <div className="loading-wrapper fade-in-out">
          <Loader size={70} />
        </div>
      ) : (
        <div className="kanban-board fade-in-out">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              tasks={tasks.filter(
                (t) =>
                  typeof t.status === 'string' &&
                  t.status.toLowerCase().replace(/[_\s]/g, '-') === col.id
              )}
              onTaskClick={handleOpenTask}
            />
          ))}
        </div>
      )}

      <DragOverlay>
        {activeTask && (
          <TaskCard
            task={activeTask}
            isOverlay
            style={{ pointerEvents: 'none' }}
            onClick={() => handleOpenTask(activeTask)}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
