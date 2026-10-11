import axios from './axiosInstance';

export const teamService = {
  async getMyTeams() {
    const res = await axios.get('/teams/my');
    return res.data;
  },

  async createTeam(name) {
    const res = await axios.post('/teams', { name });
    return res.data;
  },

  async joinTeam(code) {
    const res = await axios.post('/teams/join', { code });
    return res.data;
  },

  async addMember(teamId, identifier) {
    const res = await axios.post(`/teams/${teamId}/members`, { identifier });
    return res.data;
  },

  async removeMember(teamId, userId) {
    const res = await axios.delete(`/teams/${teamId}/members/${userId}`);
    return res.data;
  },

  async searchGlobalUsers(query) {
    if (!query || query.length < 2) return [];
    const res = await axios.get(`/users/search-global?search=${query}`);
    return res.data;
  },
};
