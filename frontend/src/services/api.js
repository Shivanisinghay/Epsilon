import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api',
  withCredentials: true, // This is important for handling sessions and auth cookies
});

// You can also add interceptors here for handling tokens or errors globally
api.interceptors.request.use(config => {
    // You can retrieve the token from local storage or context if you have one
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;