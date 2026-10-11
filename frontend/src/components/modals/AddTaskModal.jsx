import { useState, useEffect } from 'react';
import TaskModalLayout from '../forms/TaskModalLayout';
import TaskFormFields from '../forms/TaskFormFields';
import { useTaskForm } from '../../hooks/useTaskForm';
import { useTasks } from '../../context/TaskContext';
import { useColumns } from '../../context/ColumnContext';
import { useTaskTypes } from '../../context/TaskTypeContext';
import { useTeam } from '../../context/TeamContext';
import { taskService } from '../../api/taskService';
import { getAllUsers, searchUsers } from '../../api/userService';
import { useToast } from '../../context/ToastContext';

const AddTaskModal = ({
  isOpen,
  onClose,
  initialDate,
  initialStartTime,
}) => {
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
  const { taskTypes } = useTaskTypes();
  const { activeTeam } = useTeam();
  const [userOptions, setUserOptions] = useState([]);

  const defaultColumn = columns.find((c) => c.is_default && c.name === 'todo');
  const [selectedColumnId, setSelectedColumnId] = useState(null);
  const [selectedTypeId, setSelectedTypeId] = useState(null);

  useEffect(() => {
    if (defaultColumn && !selectedColumnId) {
      setSelectedColumnId(defaultColumn.id);
    }
  }, [defaultColumn, selectedColumnId]);

  useEffect(() => {
    if (taskTypes.length > 0 && !selectedTypeId) {
      setSelectedTypeId(taskTypes[0].id);
    }
  }, [taskTypes, selectedTypeId]);

  useEffect(() => {
    if (initialDate) setValue('date', initialDate);
    if (initialStartTime) {
      setValue('start_time', initialStartTime);
      const [h, m] = initialStartTime.split(':').map(Number);
      const endH = String(Math.min(23, h + 1)).padStart(2, '0');
      setValue('end_time', `${endH}:${String(m).padStart(2, '0')}`);
    }
  }, [initialDate, initialStartTime, setValue]);

  useEffect(() => {
    if (isOpen) {
      getAllUsers().then(setUserOptions).catch(console.error);
    }
  }, [isOpen, activeTeam]);

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
      title="Створити задачу / подію"
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
            Створити
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

export default AddTaskModal;
