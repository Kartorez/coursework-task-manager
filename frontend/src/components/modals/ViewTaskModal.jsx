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
        <button type="button" className="form-button button" onClick={onClose}>
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
