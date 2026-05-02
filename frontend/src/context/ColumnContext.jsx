import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { columnService } from '../api/columnService';
import { useAuth } from './AuthContext';

const ColumnContext = createContext();

export const ColumnProvider = ({ children }) => {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await columnService.getAll();
        setColumns(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const addColumn = useCallback(async (name, color) => {
    const col = await columnService.create({
      name,
      color,
      position: 0,
    });
    setColumns((prev) => [...prev, col]);
  }, []);

  const removeColumn = useCallback(async (id) => {
    await columnService.delete(id);
    setColumns((prev) => prev.filter((c) => c.id !== Number(id)));
  }, []);

  const value = useMemo(
    () => ({ columns, setColumns, loading, addColumn, removeColumn }),
    [columns, loading, addColumn, removeColumn]
  );

  return (
    <ColumnContext.Provider value={value}>{children}</ColumnContext.Provider>
  );
};

export const useColumns = () => useContext(ColumnContext);
