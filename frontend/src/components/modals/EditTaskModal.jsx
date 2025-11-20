import { useEffect, useState } from 'react';
import TaskModalLayout from '../forms/TaskModalLayout';
import TaskFormFields from '../forms/TaskFormFields';
import { useTaskForm } from '../../hooks/useTaskForm';
import { useTasks } from '../../context/TaskContext';
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
  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    getAllUsers().then(setUserOptions).catch(console.error);
  }, []);

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
        description: data.description.trim(),
        tags: data.tags
          ? data.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        assignees: data.assignees || [],
      };

      const updated = await taskService.update(task.id, updatedTask);

      if (onSave) onSave(updated);

      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

      onClose();
      showToast('Задача успішно змінена ', 'success');
    } catch (error) {
      showToast('Задача не вдалось змінити ', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await taskService.delete(task.id);

      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      showToast('Задачу видалено', 'success');

      onClose();
    } catch (error) {
      showToast('Не вдалось видалити задачу', 'error');
    }
  };

  return (
    <TaskModalLayout
      isOpen={isOpen}
      onClose={onClose}
      onDelete={handleDelete}
      showDelete={true}
      title="Редагувати задачу"
      buttons={
        <>
          <button
            type="button"
            className="form-button button"
            onClick={onClose}
          >
            Закрити
          </button>
          <button
            type="button"
            className="form-button button"
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
      />
    </TaskModalLayout>
  );
};

export default EditTaskModal;
