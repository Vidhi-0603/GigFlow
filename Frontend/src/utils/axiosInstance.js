import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 60000,
    withCredentials: true,
});

export default axiosInstance;