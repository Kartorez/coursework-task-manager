import axiosInstance from './axiosInstance';

export const taskTypeService = {
  async getAll() {
    const { data } = await axiosInstance.get('/task-types');
    return data;
  },

  async create(typeData) {
    const { data } = await axiosInstance.post('/task-types', typeData);
    return data;
  },

  async update(id, typeData) {
    const { data } = await axiosInstance.put(`/task-types/${id}`, typeData);
    return data;
  },

  async delete(id) {
    const { data } = await axiosInstance.delete(`/task-types/${id}`);
    return data;
  },
};
