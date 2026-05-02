import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { taskService } from '../api/taskService';
import { useAuth } from './AuthContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const value = useMemo(() => ({ tasks, setTasks, loading }), [tasks, loading]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => useContext(TaskContext);
