import { useState, useEffect } from 'react';
import TaskModalLayout from '../forms/TaskModalLayout';
import TaskFormFields from '../forms/TaskFormFields';
import { useTaskForm } from '../../hooks/useTaskForm';
import { useTasks } from '../../context/TaskContext';
import { useColumns } from '../../context/ColumnContext';
import { taskService } from '../../api/taskService';
import { getAllUsers, searchUsers } from '../../api/userService';
import { useToast } from '../../context/ToastContext';

const AddTaskModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useTaskForm();

  const { showToast } = useToast();
  const { setTasks } = useTasks();
  const { columns } = useColumns();
  const [userOptions, setUserOptions] = useState([]);

  const defaultColumn = columns.find((c) => c.is_default && c.name === 'todo');
  const [selectedColumnId, setSelectedColumnId] = useState(null);

  useEffect(() => {
    if (defaultColumn && !selectedColumnId) {
      setSelectedColumnId(defaultColumn.id);
    }
  }, [defaultColumn, selectedColumnId]);

  useEffect(() => {
    getAllUsers().then(setUserOptions).catch(console.error);
  }, []);

  const loadAssigneeOptions = async (inputValue) => {
    try {
      return await searchUsers(inputValue);
    } catch {
      return [];
    }
  };

  const assigneeIds = watch('assignees') || [];
  const assigneeValue = userOptions.filter((opt) =>
    assigneeIds.includes(opt.value)
  );

  const onSubmit = async (data) => {
    try {
      const newTask = {
        title: data.title.trim(),
        description: data.description.trim(),
        tags: data.tags
          ? data.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        assignees: data.assignees || [],
        column_id: selectedColumnId, // ✅ тепер передається
      };

      const created = await taskService.create(newTask);
      setTasks((prev) => [...prev, created]);
      reset();
      onClose();
      showToast('Задача успішно створена', 'success');
    } catch {
      showToast('Не вдалось створити задачу', 'error');
    }
  };

  return (
    <TaskModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Додати задачу"
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
            Додати
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
      />
    </TaskModalLayout>
  );
};

export default AddTaskModal;
