import { useEffect, useState } from 'react';
import TaskModalLayout from '../forms/TaskModalLayout';
import TaskFormFields from '../forms/TaskFormFields';
import { useTaskForm } from '../../hooks/useTaskForm';
import { useTasks } from '../../context/TaskContext';
import { useColumns } from '../../context/ColumnContext';
import { useTeam } from '../../context/TeamContext';
import { taskService } from '../../api/taskService';
import { getAllUsers, searchUsers } from '../../api/userService';
import { useToast } from '../../context/ToastContext';

const EditTaskModal = ({ isOpen, onClose, task, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useTaskForm(task);

  const { showToast } = useToast();
  const { setTasks } = useTasks();
  const { columns } = useColumns();
  const { activeTeam } = useTeam();
  const [userOptions, setUserOptions] = useState([]);

  const [selectedColumnId, setSelectedColumnId] = useState(
    task?.column_id ?? null
  );
  const [selectedTypeId, setSelectedTypeId] = useState(
    task?.task_type_id ?? task?.taskType?.id ?? null
  );

  useEffect(() => {
    if (task?.column_id) {
      setSelectedColumnId(task.column_id);
    }
    if (task?.task_type_id || task?.taskType?.id) {
      setSelectedTypeId(task.task_type_id || task.taskType.id);
    }
  }, [task]);

  useEffect(() => {
    if (isOpen) {
      getAllUsers().then(setUserOptions).catch(console.error);
    }
  }, [isOpen, activeTeam]);

  const loadAssigneeOptions = async (inputValue) => {
    try {
      return await searchUsers(inputValue);
    } catch (err) {
      console.error('Помилка при пошуку користувачів:', err);
      return [];
    }
  };

  const assigneeIds = watch('assignees') || [];
  const assigneeValue = userOptions.filter((opt) =>
    assigneeIds.includes(opt.value)
  );

  const onSubmit = async (data) => {
    try {
      const updatedTask = {
        title: data.title.trim(),
        description: (data.description || '').trim(),
        tags: data.tags
          ? data.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        assignees: data.assignees || [],
        column_id: selectedColumnId,
        task_type_id: selectedTypeId,
        date: data.date || null,
        start_time: data.start_time || null,
        end_time: data.end_time || null,
        duration: data.duration || '1 год',
      };

      const updated = await taskService.update(task.id, updatedTask);

      if (onSave) onSave(updated);

      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

      onClose();
      showToast('Задача успішно змінена', 'success');
    } catch {
      showToast('Не вдалось змінити задачу', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await taskService.delete(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      showToast('Задачу видалено', 'success');
      onClose();
    } catch {
      showToast('Не вдалось видалити задачу', 'error');
    }
  };

  return (
    <TaskModalLayout
      isOpen={isOpen}
      onClose={onClose}
      onDelete={handleDelete}
      showDelete={true}
      title="Редагувати задачу / подію"
      buttons={
        <>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#252832] transition-colors"
            onClick={onClose}
          >
            Скасувати
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-colors"
            onClick={handleSubmit(onSubmit)}
          >
            Зберегти
          </button>
        </>
      }
    >
      <TaskFormFields
        register={register}
        errors={errors}
        assigneeOptions={userOptions}
        assigneeValue={assigneeValue}
        onAssigneeChange={(selected) =>
          setValue('assignees', selected ? selected.map((s) => s.value) : [])
        }
        loadAssigneeOptions={loadAssigneeOptions}
        columns={columns}
        selectedColumnId={selectedColumnId}
        onColumnChange={setSelectedColumnId}
        selectedTypeId={selectedTypeId}
        onTypeChange={setSelectedTypeId}
      />
    </TaskModalLayout>
  );
};

export default EditTaskModal;
