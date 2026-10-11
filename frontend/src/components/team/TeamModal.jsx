import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTeam } from '../../context/TeamContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const TeamModal = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const {
    teams,
    activeTeam,
    setActiveTeamId,
    isTeamModalOpen,
    closeTeamModal,
    createTeam,
    joinTeam,
    addMember,
    removeMember,
  } = useTeam();

  const [activeTab, setActiveTab] = useState('manage');
  const [newTeamName, setNewTeamName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [memberIdentifier, setMemberIdentifier] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isTeamModalOpen) return null;

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    showToast('Код команди скопійовано в буфер обміну', 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setIsSubmitting(true);
    try {
      await createTeam(newTeamName.trim());
      setNewTeamName('');
      setActiveTab('manage');
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setIsSubmitting(true);
    try {
      await joinTeam(joinCode.trim());
      setJoinCode('');
      setActiveTab('manage');
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberIdentifier.trim() || !activeTeam) return;
    setIsSubmitting(true);
    try {
      await addMember(activeTeam.id, memberIdentifier.trim());
      setMemberIdentifier('');
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOwner =
    activeTeam && Number(activeTeam.owner_id) === Number(user?.id);

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#18191d] border border-gray-200 dark:border-[#262830] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-gray-800 dark:text-gray-100 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#24262d]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500 font-bold text-lg">
              👥
            </span>
            <div>
              <h2 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">
                Команди
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Спільні завдання та учасники
              </p>
            </div>
          </div>
          <button
            onClick={closeTeamModal}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            ✕
          </button>
        </div>

        {teams.length > 0 && (
          <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-gray-100 dark:border-[#24262d] bg-gray-50/50 dark:bg-[#15161a]">
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'manage'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Моя команда
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'create'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              + Створити команду
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'join'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Приєднатися за кодом
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {teams.length === 0 ? (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-3xl shadow-sm">
                  🤝
                </div>
                <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">
                  Ви ще не у команді
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                  Створіть свою команду або введіть код запрошення від колеги, щоб
                  бачити учасників та призначати завдання один одному.
                </p>
              </div>

              <form
                onSubmit={handleCreateTeam}
                className="p-4 rounded-xl border border-gray-200 dark:border-[#2a2c35] bg-gray-50/60 dark:bg-[#1b1c22] space-y-3"
              >
                <div className="font-semibold text-xs text-gray-700 dark:text-gray-300">
                  Створити нову команду
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Назва команди (напр. Dev Team)"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-[#323540] bg-white dark:bg-[#141518] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !newTeamName.trim()}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50"
                  >
                    Створити
                  </button>
                </div>
              </form>

              <form
                onSubmit={handleJoinTeam}
                className="p-4 rounded-xl border border-gray-200 dark:border-[#2a2c35] bg-gray-50/60 dark:bg-[#1b1c22] space-y-3"
              >
                <div className="font-semibold text-xs text-gray-700 dark:text-gray-300">
                  Приєднатися до існуючої за кодом
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="6-значний код (напр. 8K2M9Q)"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={10}
                    className="flex-1 px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-lg border border-gray-300 dark:border-[#323540] bg-white dark:bg-[#141518] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !joinCode.trim()}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-gray-800 dark:bg-white/10 hover:bg-gray-900 dark:hover:bg-white/20 text-white transition-all disabled:opacity-50"
                  >
                    Приєднатися
                  </button>
                </div>
              </form>
            </div>
          ) : activeTab === 'create' ? (
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Створити ще одну команду
              </h3>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Назва команди
                </label>
                <input
                  type="text"
                  placeholder="Введіть назву команди"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-[#323540] bg-white dark:bg-[#141518] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('manage')}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-[#323540] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTeamName.trim()}
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50"
                >
                  Створити команду
                </button>
              </div>
            </form>
          ) : activeTab === 'join' ? (
            <form onSubmit={handleJoinTeam} className="space-y-4">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                Приєднатися за кодом
              </h3>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Код запрошення команди
                </label>
                <input
                  type="text"
                  placeholder="Введіть код команди (напр. 8K2M9Q)"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-lg border border-gray-300 dark:border-[#323540] bg-white dark:bg-[#141518] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('manage')}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-[#323540] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !joinCode.trim()}
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50"
                >
                  Приєднатися
                </button>
              </div>
            </form>
          ) : (
            activeTeam && (
              <div className="space-y-5">
                {teams.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                      Команда:
                    </span>
                    {teams.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setActiveTeamId(t.id)}
                        className={`px-2.5 py-1 text-xs rounded-lg font-medium flex-shrink-0 transition-all ${
                          t.id === activeTeam.id
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                            : 'bg-gray-100 dark:bg-[#20222a] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#2a2c35]'
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                )}

                <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-50/50 dark:bg-[#1a202c]/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-base text-gray-900 dark:text-white">
                        {activeTeam.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activeTeam.members?.length || 1} учасник(ів)
                      </p>
                    </div>
                    {isOwner ? (
                      <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        Ви власник
                      </span>
                    ) : (
                      <button
                        onClick={() => removeMember(activeTeam.id, user.id)}
                        className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                      >
                        Покинути команду
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#141518] border border-gray-200/80 dark:border-[#2a2c35]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Код запрошення:
                      </span>
                      <span className="font-mono font-bold tracking-widest text-sm text-blue-600 dark:text-blue-400">
                        {activeTeam.code}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(activeTeam.code)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm"
                    >
                      {copiedCode ? 'Скопійовано! ✓' : 'Скопіювати'}
                    </button>
                  </div>
                </div>

                <form onSubmit={handleAddMember} className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Додати учасника в команду
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Введіть email або ім’я користувача"
                      value={memberIdentifier}
                      onChange={(e) => setMemberIdentifier(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-gray-300 dark:border-[#323540] bg-white dark:bg-[#141518] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || !memberIdentifier.trim()}
                      className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50"
                    >
                      + Додати
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">
                    Користувач з цим email або логіном миттєво з&apos;явиться у команді.
                  </p>
                </form>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Учасники команди ({activeTeam.members?.length || 0})
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100 dark:divide-[#24262d] border border-gray-200 dark:border-[#2a2c35] rounded-xl overflow-hidden bg-gray-50/40 dark:bg-[#16171c]">
                    {(activeTeam.members || []).map((m) => {
                      const isMemberOwner =
                        Number(m.id) === Number(activeTeam.owner_id);
                      const isCurrentUser = Number(m.id) === Number(user?.id);

                      return (
                        <div
                          key={m.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-100/50 dark:hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center">
                              {m.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                                {m.username}
                                {isCurrentUser && (
                                  <span className="text-[10px] text-gray-400">
                                    (Ви)
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-gray-500 dark:text-gray-400">
                                {m.email}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isMemberOwner ? (
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                Власник
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-gray-200 dark:bg-[#252832] text-gray-600 dark:text-gray-400">
                                Учасник
                              </span>
                            )}

                            {isOwner && !isCurrentUser && (
                              <button
                                onClick={() =>
                                  removeMember(activeTeam.id, m.id)
                                }
                                className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors text-xs"
                                title="Видалити з команди"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        <div className="px-6 py-3 border-t border-gray-100 dark:border-[#24262d] bg-gray-50 dark:bg-[#15161a] flex justify-end">
          <button
            onClick={closeTeamModal}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-gray-200 dark:bg-[#24262f] text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-[#2e313c] transition-colors"
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default TeamModal;
