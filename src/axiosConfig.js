import axios from 'redaxios';

const token = localStorage.getItem('token');

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Vous pouvez définir la baseURL ici
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;