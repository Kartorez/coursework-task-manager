import TaskModalLayout from '../forms/TaskModalLayout';
import TaskFormFields from '../forms/TaskFormFields';
import { useTaskForm } from '../../hooks/useTaskForm';

const ViewTaskModal = ({ isOpen, onClose, task }) => {
  const {
    register,
    formState: { errors },
  } = useTaskForm(task);

  return (
    <TaskModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Детальніше"
      buttons={
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium rounded-xl bg-[#252832] hover:bg-[#2d303c] text-white transition-colors"
          onClick={onClose}
        >
          Закрити
        </button>
      }
    >
      <TaskFormFields
        register={register}
        errors={errors}
        readOnly
        task={task}
      />
    </TaskModalLayout>
  );
};

export default ViewTaskModal;
