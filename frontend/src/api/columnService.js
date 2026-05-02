import axiosInstance from './axiosInstance';

export const columnService = {
  async getAll() {
    const { data } = await axiosInstance.get('/columns');
    return data;
  },

  async create(column) {
    const { data } = await axiosInstance.post('/columns', column);
    return data;
  },

  async update(id, column) {
    const { data } = await axiosInstance.put(`/columns/${id}`, column);
    return data;
  },

  async delete(id) {
    const { data } = await axiosInstance.delete(`/columns/${id}`);
    return data;
  },
};
