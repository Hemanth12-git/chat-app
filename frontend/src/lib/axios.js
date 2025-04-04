const axios = require('axios');

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5001/api',
    withCredentials: true,
});

module.exports = axiosInstance;
