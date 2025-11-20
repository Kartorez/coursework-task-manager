import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect } from 'react';

const schema = yup.object({
  title: yup.string().required('Введіть назву завдання'),
  description: yup.string().required('Введіть опис'),
  tags: yup.string(),
  assignees: yup.array().of(yup.number()).default([]),
});

export const useTaskForm = (task) => {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      tags: '',
      assignees: [],
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
      });
    } else {
      reset({
        title: '',
        description: '',
        tags: '',
        assignees: [],
      });
    }
  }, [task, reset]);

  return form;
};
