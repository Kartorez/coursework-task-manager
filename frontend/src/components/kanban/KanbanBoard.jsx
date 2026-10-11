import { useState, useCallback, useMemo, Fragment } from 'react';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import Loader from '../Loader';
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

const ColumnDropZone = ({
  index,
  isDraggingColumn,
  isForbidden,
  onDropColumn,
}) => {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes('application/x-kanban-column')) {
          e.preventDefault();
          e.dataTransfer.dropEffect = isForbidden ? 'none' : 'move';
          if (!isForbidden && !isOver) {
            setIsOver(true);
          }
        }
      }}
      onDragEnter={(e) => {
        if (
          e.dataTransfer.types.includes('application/x-kanban-column') &&
          !isForbidden
        ) {
          setIsOver(true);
        }
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsOver(false);
        }
      }}
      onDrop={(e) => {
        setIsOver(false);
        if (isForbidden) return;
        const sourceId = e.dataTransfer.getData('application/x-kanban-column');
        if (sourceId) {
          e.preventDefault();
          onDropColumn(sourceId, index);
        }
      }}
      className={`relative self-stretch flex items-center justify-center flex-shrink-0 transition-all select-none ${
        index === 0 ? 'w-2' : 'w-4'
      }`}
    >
      {isDraggingColumn && !isForbidden && (
        <div className="absolute inset-y-0 -left-3 -right-3 z-30 cursor-pointer" />
      )}

      <div
        className={`transition-all duration-200 rounded-full flex flex-col items-center justify-between py-2 ${
          isOver && !isForbidden
            ? 'w-1.5 h-full min-h-[320px] bg-blue-500 shadow-[0_0_14px_rgba(59,130,246,0.9)] scale-100 opacity-100 z-40'
            : isDraggingColumn && !isForbidden
            ? 'w-1 h-3/4 border-r-2 border-dashed border-blue-400/40 opacity-70'
            : 'w-0 opacity-0'
        }`}
      >
        {isOver && !isForbidden && (
          <>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-white dark:ring-gray-900 shadow-md -mt-1" />
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-white dark:ring-gray-900 shadow-md -mb-1" />
          </>
        )}
      </div>
    </div>
  );
};

const KanbanBoard = () => {
  const { tasks, setTasks, loading: tasksLoading } = useTasks();
  const {
    columns,
    setColumns,
    loading: columnsLoading,
    addColumn,
    removeColumn,
  } = useColumns();
  const { openModal } = useModal();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTask, setActiveTask] = useState(null);
  const [draggingColumnId, setDraggingColumnId] = useState(null);

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

  const sourceColIdx = useMemo(() => {
    if (!draggingColumnId) return -1;
    return columns.findIndex((c) => String(c.id) === String(draggingColumnId));
  }, [draggingColumnId, columns]);

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

  const handleColumnDragStart = useCallback((id) => {
    setDraggingColumnId(String(id));
  }, []);

  const handleColumnDragEnd = useCallback(() => {
    setDraggingColumnId(null);
  }, []);

  const handleMoveColumnToIndex = useCallback(
    (sourceId, targetIndex) => {
      setDraggingColumnId(null);
      setColumns((prev) => {
        const sourceIdx = prev.findIndex((c) => String(c.id) === String(sourceId));
        if (sourceIdx === -1) return prev;

        if (targetIndex === sourceIdx || targetIndex === sourceIdx + 1) {
          return prev;
        }

        const reordered = [...prev];
        const [moved] = reordered.splice(sourceIdx, 1);
        const finalIndex = sourceIdx < targetIndex ? targetIndex - 1 : targetIndex;
        reordered.splice(finalIndex, 0, moved);

        if (user?.id) {
          localStorage.setItem(
            `kanban_col_order_${user.id}`,
            JSON.stringify(reordered.map((c) => c.id))
          );
        }
        return reordered;
      });
      showToast('Порядок колонок змінено', 'success');
    },
    [setColumns, user, showToast]
  );

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
        await addColumn(name, '#3b82f6');
        showToast('Колонку створено', 'success');
      } catch {
        showToast('Не вдалось створити колонку', 'error');
      }
    },
    [addColumn, showToast]
  );

  const loading = tasksLoading || columnsLoading;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[300px]">
        <Loader size={60} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-x-auto pb-4 items-start select-none">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        modifiers={[restrictToWindowEdges]}
      >
        {columns.map((col, index) => {
          const isForbidden =
            sourceColIdx !== -1 &&
            (index === sourceColIdx || index === sourceColIdx + 1);

          return (
            <Fragment key={col.id}>
              <ColumnDropZone
                index={index}
                isDraggingColumn={!!draggingColumnId}
                isForbidden={isForbidden}
                onDropColumn={handleMoveColumnToIndex}
              />
              <KanbanColumn
                id={String(col.id)}
                title={col.name}
                color={col.color}
                isDefault={col.is_default}
                tasks={tasksByColumn[col.id] || []}
                onTaskClick={handleOpenTask}
                onDelete={handleRemoveColumn}
                onColumnDragStart={handleColumnDragStart}
                onColumnDragEnd={handleColumnDragEnd}
              />
            </Fragment>
          );
        })}

        <ColumnDropZone
          index={columns.length}
          isDraggingColumn={!!draggingColumnId}
          isForbidden={
            sourceColIdx !== -1 &&
            (columns.length === sourceColIdx ||
              columns.length === sourceColIdx + 1)
          }
          onDropColumn={handleMoveColumnToIndex}
        />

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

      <div className="ml-2 flex-shrink-0">
        <AddColumn onAdd={handleAddColumn} />
      </div>
    </div>
  );
};

export default KanbanBoard;
