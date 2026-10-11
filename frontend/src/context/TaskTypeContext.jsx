import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { taskTypeService } from '../api/taskTypeService';
import { useAuth } from './AuthContext';

const TaskTypeContext = createContext();

const DEFAULT_TYPES = [
  { id: 1, name: 'Фокус', color: '#2563eb' },
  { id: 2, name: 'Зустрічі', color: '#ea580c' },
  { id: 3, name: 'Особисте', color: '#16a34a' },
];

export const TaskTypeProvider = ({ children }) => {
  const { user } = useAuth();
  const [taskTypes, setTaskTypes] = useState(DEFAULT_TYPES);
  const [selectedTypeIds, setSelectedTypeIds] = useState([1, 2, 3]);
  const [loading, setLoading] = useState(false);

  const fetchTypes = useCallback(async () => {
    if (!user) {
      setTaskTypes(DEFAULT_TYPES);
      setSelectedTypeIds([1, 2, 3]);
      return;
    }
    setLoading(true);
    try {
      const data = await taskTypeService.getAll();
      if (Array.isArray(data) && data.length > 0) {
        setTaskTypes(data);
        setSelectedTypeIds(data.map((t) => t.id));
      } else {
        setTaskTypes(DEFAULT_TYPES);
        setSelectedTypeIds([1, 2, 3]);
      }
    } catch {
      const saved = localStorage.getItem('local_task_types');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setTaskTypes(parsed);
          setSelectedTypeIds(parsed.map((t) => t.id));
        } catch {
          setTaskTypes(DEFAULT_TYPES);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  const toggleTypeFilter = (id) => {
    setSelectedTypeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addType = async (name, color) => {
    try {
      const created = await taskTypeService.create({ name, color });
      setTaskTypes((prev) => [...prev, created]);
      setSelectedTypeIds((prev) => [...prev, created.id]);
      return created;
    } catch {
      const localCreated = {
        id: Date.now(),
        name,
        color: color || '#3b82f6',
      };
      setTaskTypes((prev) => {
        const next = [...prev, localCreated];
        localStorage.setItem('local_task_types', JSON.stringify(next));
        return next;
      });
      setSelectedTypeIds((prev) => [...prev, localCreated.id]);
      return localCreated;
    }
  };

  const updateType = async (id, { name, color }) => {
    try {
      const updated = await taskTypeService.update(id, { name, color });
      setTaskTypes((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    } catch {
      setTaskTypes((prev) => {
        const next = prev.map((t) =>
          t.id === id ? { ...t, name: name || t.name, color: color || t.color } : t
        );
        localStorage.setItem('local_task_types', JSON.stringify(next));
        return next;
      });
    }
  };

  const deleteType = async (id) => {
    try {
      await taskTypeService.delete(id);
    } catch {
    }
    setTaskTypes((prev) => {
      const next = prev.filter((t) => t.id !== id);
      localStorage.setItem('local_task_types', JSON.stringify(next));
      return next;
    });
    setSelectedTypeIds((prev) => prev.filter((item) => item !== id));
  };

  return (
    <TaskTypeContext.Provider
      value={{
        taskTypes,
        selectedTypeIds,
        toggleTypeFilter,
        addType,
        updateType,
        deleteType,
        loading,
        refetch: fetchTypes,
      }}
    >
      {children}
    </TaskTypeContext.Provider>
  );
};

export const useTaskTypes = () => {
  const context = useContext(TaskTypeContext);
  if (!context) {
    throw new Error('useTaskTypes must be used within a TaskTypeProvider');
  }
  return context;
};
