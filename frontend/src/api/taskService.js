import axiosInstance from './axiosInstance';

export const taskService = {
  async getAll() {
    const { data } = await axiosInstance.get('/tasks');
    return data;
  },

  async create(task) {
    const { data } = await axiosInstance.post('/tasks', task);
    return data;
  },

  async update(id, updatedTask) {
    const { data } = await axiosInstance.put(`/tasks/${id}`, updatedTask);
    return data;
  },

  async delete(id) {
    await axiosInstance.delete(`/tasks/${id}`);
  },

  async changeColumn(id, column_id) {
    const { data } = await axiosInstance.put(`/tasks/${id}`, { column_id });
    return data;
  },
};
