import { useState, memo } from 'react';

const AddColumn = memo(({ onAdd }) => {
  const [newColName, setNewColName] = useState('');
  const [showAddCol, setShowAddCol] = useState(false);

  const handleAdd = () => {
    const name = newColName.trim();
    if (!name) return;
    onAdd(name);
    setNewColName('');
    setShowAddCol(false);
  };

  return (
    <div className="kanban-add-column">
      {showAddCol ? (
        <div className="kanban-add-column__form">
          <input
            className="kanban-add-column__input"
            value={newColName}
            onChange={(e) => setNewColName(e.target.value)}
            placeholder="Назва колонки"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <button className="button" onClick={handleAdd}>
            Додати
          </button>
          <button className="button" onClick={() => setShowAddCol(false)}>
            Скасувати
          </button>
        </div>
      ) : (
        <button
          className="kanban-add-column__btn"
          onClick={() => setShowAddCol(true)}
        >
          + Додати колонку
        </button>
      )}
    </div>
  );
});

export default AddColumn;
