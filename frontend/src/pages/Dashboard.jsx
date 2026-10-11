import KanbanBoard from '../components/kanban/KanbanBoard';

const Dashboard = () => {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden p-4 sm:p-6 bg-[#f8f9fa] dark:bg-[#131417] transition-colors">
      <KanbanBoard />
    </div>
  );
};

export default Dashboard;
