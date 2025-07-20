import axios from 'axios';
const API_URL = process.env.REACT_APP_BACKEND_URL;

const getToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const generateText = async (type, prompt) => {
  const response = await api.post('/api/text/generate', { type, prompt });
  return response.data;
};

export const generateImage = async (prompt) => {
  const response = await api.post('/api/image/generate/image', { prompt });
  return response.data;
};

export const generateAudio = async (text) => {
  const response = await api.post('/api/audio/generate/audio', { text });
  return response.data;
};