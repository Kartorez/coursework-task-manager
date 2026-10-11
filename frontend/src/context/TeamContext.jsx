import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { teamService } from '../api/teamService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [teams, setTeams] = useState([]);
  const [activeTeamId, setActiveTeamId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  const refreshTeams = useCallback(async () => {
    if (!user) {
      setTeams([]);
      setActiveTeamId(null);
      return;
    }
    setLoading(true);
    try {
      const data = await teamService.getMyTeams();
      setTeams(data);
      if (data.length > 0) {
        setActiveTeamId((prev) => {
          const exists = data.some((t) => t.id === prev);
          return exists ? prev : data[0].id;
        });
      } else {
        setActiveTeamId(null);
      }
    } catch (err) {
      console.error('Помилка завантаження команд:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshTeams();
  }, [refreshTeams]);

  const activeTeam = teams.find((t) => t.id === activeTeamId) || teams[0] || null;

  const createTeam = async (name) => {
    try {
      const created = await teamService.createTeam(name);
      setTeams((prev) => [...prev, created]);
      setActiveTeamId(created.id);
      showToast('Команду успішно створено!', 'success');
      return created;
    } catch (err) {
      const msg = err.response?.data?.message || 'Не вдалося створити команду';
      showToast(msg, 'error');
      throw err;
    }
  };

  const joinTeam = async (code) => {
    try {
      const joined = await teamService.joinTeam(code);
      setTeams((prev) => {
        const filtered = prev.filter((t) => t.id !== joined.id);
        return [...filtered, joined];
      });
      setActiveTeamId(joined.id);
      showToast('Ви успішно приєдналися до команди!', 'success');
      return joined;
    } catch (err) {
      const msg = err.response?.data?.message || 'Не вдалося приєднатися до команди';
      showToast(msg, 'error');
      throw err;
    }
  };

  const addMember = async (teamId, identifier) => {
    try {
      const updatedTeam = await teamService.addMember(teamId, identifier);
      setTeams((prev) => prev.map((t) => (t.id === updatedTeam.id ? updatedTeam : t)));
      showToast('Учасника додано до команди!', 'success');
      return updatedTeam;
    } catch (err) {
      const msg = err.response?.data?.message || 'Не вдалося додати учасника';
      showToast(msg, 'error');
      throw err;
    }
  };

  const removeMember = async (teamId, memberUserId) => {
    try {
      await teamService.removeMember(teamId, memberUserId);
      if (Number(memberUserId) === Number(user?.id)) {
        setTeams((prev) => prev.filter((t) => t.id !== teamId));
        setActiveTeamId((prev) => (prev === teamId ? null : prev));
        showToast('Ви покинули команду', 'success');
      } else {
        setTeams((prev) =>
          prev.map((t) => {
            if (t.id !== teamId) return t;
            return {
              ...t,
              members: t.members.filter((m) => m.id !== memberUserId),
            };
          })
        );
        showToast('Учасника видалено', 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Помилка видалення учасника';
      showToast(msg, 'error');
      throw err;
    }
  };

  const openTeamModal = () => setIsTeamModalOpen(true);
  const closeTeamModal = () => setIsTeamModalOpen(false);

  return (
    <TeamContext.Provider
      value={{
        teams,
        activeTeam,
        activeTeamId,
        setActiveTeamId,
        loading,
        refreshTeams,
        createTeam,
        joinTeam,
        addMember,
        removeMember,
        isTeamModalOpen,
        openTeamModal,
        closeTeamModal,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};
