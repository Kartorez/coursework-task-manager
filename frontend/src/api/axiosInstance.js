import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let subscribers = [];

const onTokenRefreshed = (token) => {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribers.push((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken = data.accessToken;
        localStorage.setItem('token', newToken);
        axiosInstance.defaults.headers.Authorization = `Bearer ${newToken}`;
        onTokenRefreshed(newToken);
        return axiosInstance(original);
      } catch (err) {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('logout'));
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
