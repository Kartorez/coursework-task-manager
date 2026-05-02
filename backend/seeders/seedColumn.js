import Column from '../models/Column.js';

const defaultColumns = [
  { name: 'todo', color: '#8892b0', position: 0 },
  { name: 'in-progress', color: '#f59e0b', position: 1 },
  { name: 'done', color: '#22c55e', position: 2 },
];

const seedDefaultColumns = async () => {
  for (const col of defaultColumns) {
    await Column.findOrCreate({
      where: { name: col.name, is_default: true },
      defaults: { ...col, is_default: true, user_id: null },
    });
  }
};

export default seedDefaultColumns;
