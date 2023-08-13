import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { loginSuccess } from '~/redux/features/authSlice';

function axiosJWT(user, dispatch) {
    const axiosJWT = axios.create({
        baseURL: 'http://localhost:5000/api',
        withCredentials: true,
    });

    axiosJWT.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodedToken = jwtDecode(user?.accessToken);

            if (decodedToken.exp < date.getTime() / 1000) {
                const response = await axios.get('http://localhost:5000/api/auth/refresh_token', {
                    headers: {
                        token: `Bearer ${user.accessToken}`,
                        _id: user._id,
                    },
                });

                dispatch(
                    loginSuccess({
                        ...user,
                        accessToken: response.data.accessToken,
                    }),
                );

                config.headers['token'] = `Bearer ${response.data.accessToken}`;
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        },
    );

    return axiosJWT;
}

export default axiosJWT;
