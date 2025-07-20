import axios from 'axios';
const API_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const generateText = async (type, prompt, variations = 1) => {
  const response = await api.post('/text/generate', { type, prompt, variations });
  return response.data;
};

export const generateImage = async (prompt, width, height) => {
  const response = await api.post('/image/generate/image', { prompt, width, height });
  return response.data;
};

export const generateAudio = async (text) => {
  const response = await api.post('/audio/generate/audio', { text });
  return response.data;
};

export const saveContent = async (contentData) => {
    const response = await api.post('/content', contentData);
    return response.data;
};

export const getContentHistory = async () => {
    const response = await api.get('/content');
    return response.data;
};

// Function to call the new DELETE endpoint
export const deleteContent = async (id) => {
  const response = await api.delete(`/content/${id}`);
  return response.data;
};