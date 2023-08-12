import axios from 'axios';

function axiosJWT() {
    const axiosJWT = axios.create();

    //cookie refresh token
    console.log(document.cookie);
}

export default axiosJWT;
