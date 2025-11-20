import { createContext, useContext, useState, useEffect } from 'react';
import { taskService } from '../api/taskService';
import { useAuth } from './AuthContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const loadTasks = async () => {
      setLoading(true);

      try {
        const data = await taskService.getAll();
        setTasks(data);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [user]);

  return (
    <TaskContext.Provider value={{ tasks, setTasks, loading }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
