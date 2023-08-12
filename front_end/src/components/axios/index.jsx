import axios from 'axios';

function axiosJWT() {
    const axiosJWT = axios.create({
        baseURL: 'http://localhost:5000/',
        withCredentials: true,
        credentials: 'include',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token , Authorization',
            'Content-Type': 'application/json',
        },
    });
}

export default axiosJWT;
