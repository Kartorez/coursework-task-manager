import Tag from '../models/Tag.js';
import ApiError from '../error/ApiError.js';

class TagController {
  async create(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        return next(ApiError.badRequest('Tag name required'));
      }
      const [tag, created] = await Tag.findOrCreate({ where: { name } });
      res.json(tag);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const tags = await Tag.findAll();
      res.json(tags);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const tag = await Tag.findByPk(id);
      if (!tag) {
        return next(ApiError.notFound('Tag not found'));
      }
      await tag.destroy();
      res.json({ message: 'Tag deleted' });
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

export default new TagController();
