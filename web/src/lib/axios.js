import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const serverUrl = baseUrl.replace('/api', '');
    // Ensure path doesn't start with a slash if serverUrl ends with one
    return `${serverUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

export default api;
