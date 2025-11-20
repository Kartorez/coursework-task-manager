import axios from './axiosInstance';

export const getAllUsers = async () => {
  const res = await axios.get('/users');
  return res.data.map((u) => ({
    value: u.id,
    label: u.username,
  }));
};

export const searchUsers = async (query) => {
  if (!query || query.length < 2) return [];
  const res = await axios.get(`/users?search=${query}`);
  return res.data.map((u) => ({
    value: u.id,
    label: u.username,
  }));
};
