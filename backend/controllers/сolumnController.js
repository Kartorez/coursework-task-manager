import Column from '../models/Column.js';

class ColumnController {
  async getAll(req, res, next) {
    try {
      const { Op } = await import('sequelize');
      const columns = await Column.findAll({
        where: {
          [Op.or]: [{ is_default: true }, { user_id: req.user.id }],
        },
        order: [['position', 'ASC']],
      });
      res.json(columns);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async create(req, res) {
    try {
      const { name, color, position } = req.body;
      if (!name) return res.status(400).json({ message: 'Name is required' });

      const column = await Column.create({
        name,
        color,
        position,
        user_id: req.user.id,
        is_default: false,
      });

      res.status(201).json(column);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async update(req, res, next) {
    try {
      const column = await Column.findByPk(req.params.id);
      if (!column) return res.status(404).json({ message: 'Not found' });
      if (column.is_default)
        return res.status(403).json({ message: 'Cannot edit default column' });
      if (Number(column.user_id) !== Number(req.user.id))
        return res.status(403).json({ message: 'Forbidden' });

      await column.update(req.body);
      res.json(column);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async delete(req, res, next) {
    try {
      const column = await Column.findByPk(req.params.id);

      if (!column) return res.status(404).json({ message: 'Not found' });
      if (column.is_default)
        return res
          .status(403)
          .json({ message: 'Cannot delete default column' });
      if (Number(column.user_id) !== Number(req.user.id))
        return res.status(403).json({ message: 'Forbidden' });

      await column.destroy();
      console.log('column destroyed');
      res.json({ message: 'Deleted' });
    } catch (e) {
      console.error('DELETE column error:', e);
      res.status(500).json({ message: e.message });
    }
  }
}

export default new ColumnController();
