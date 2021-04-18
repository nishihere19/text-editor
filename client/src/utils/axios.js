import axios from "axios"

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    responseType: 'json',
    timeout: 5000,
});

axiosInstance.defaults.withCredentials = true

export {axiosInstance}