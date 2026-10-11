import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';

const schema = yup.object({
  title: yup.string().required('Введіть назву завдання'),
  description: yup.string().default(''),
  tags: yup.string().default(''),
  assignees: yup.array().of(yup.number()).default([]),
  task_type_id: yup.number().nullable().default(null),
  date: yup.string().default(''),
  start_time: yup.string().default(''),
  end_time: yup.string().default(''),
  duration: yup.string().default('1 год'),
});

export const useTaskForm = (task) => {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      tags: '',
      assignees: [],
      task_type_id: null,
      date: '',
      start_time: '',
      end_time: '',
      duration: '1 год',
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (task) {
      reset({
        title: task.title || '',
        description: task.description || '',
        tags: Array.isArray(task.tags)
          ? task.tags.map((t) => t.name).join(', ')
          : '',
        assignees: Array.isArray(task.assignees)
          ? task.assignees.map((a) => a.id)
          : [],
        task_type_id: task.task_type_id || task.taskType?.id || null,
        date: task.date || '',
        start_time: task.start_time || '',
        end_time: task.end_time || '',
        duration: task.duration || '1 год',
      });
    } else {
      reset({
        title: '',
        description: '',
        tags: '',
        assignees: [],
        task_type_id: null,
        date: '',
        start_time: '',
        end_time: '',
        duration: '1 год',
      });
    }
  }, [task, reset]);

  return form;
};
