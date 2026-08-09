import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://darkgoldenrod-anteater-579870.hostingersite.com/api' : 'http://127.0.0.1:8000/api'),
    headers: {
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
    if (path.startsWith('data:')) return path; // Handle base64 encoded images from database
    
    let baseUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://darkgoldenrod-anteater-579870.hostingersite.com/api' : 'http://127.0.0.1:8000/api');
    
    // Safely remove the trailing /api
    if (baseUrl.endsWith('/api')) {
        baseUrl = baseUrl.slice(0, -4);
    }
    
    // Ensure path doesn't start with a slash if baseUrl ends with one
    return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
};

export default api;
