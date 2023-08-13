import { message } from 'antd';
import {
    loginFail,
    loginStart,
    loginSuccess,
    registerStart,
    registerSuccess,
    registerFail,
    setAuth,
    logoutStart,
    logoutSuccess,
    logoutFail,
} from './authSlice';
import {
    getChatFail,
    getChatStart,
    getChatSuccess,
    getRoomsFail,
    getRoomsStart,
    getRoomsSuccess,
    sendMessageFail,
    sendMessageStart,
    sendMessageSuccess,
} from './roomSlice';
import {
    setChangePasswordFail,
    setChangePasswordStart,
    setChangePasswordSuccess,
    setProfileFail,
    setProfileStart,
    setProfileSuccess,
} from './userSlice';
import { getSearchFail, getSearchStart, getSearchSuccess } from './searchSlice';

export const loginRequest = async (data, dispatch, axios, navigate) => {
    dispatch(loginStart());
    try {
        const response = await axios.post('https://chat-with-mongoo-db-l2fr.vercel.app/api/auth/login', data, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
        dispatch(loginSuccess(response.data));
        navigate('/');
    } catch (error) {
        message.error(error.response.data.msg);
        dispatch(loginFail());
    }
};

export const logoutRequest = async (user, dispatch, axios, navigate) => {
    dispatch(logoutStart());
    try {
        await axios.get(`/auth/logout`, {
            headers: {
                token: `Bearer ${user.accessToken}`,
                _id: user._id,
            },
            withCredentials: true,
        });
        dispatch(setAuth(false));
        dispatch(logoutSuccess());
        dispatch(getChatSuccess([]));
        message.success('Logout success');
        navigate('/auth');
    } catch (error) {
        message.error(error.response.data.msg);
        dispatch(logoutFail());
    }
};

export const registerRequest = async (data, dispatch, axios) => {
    dispatch(registerStart());
    try {
        await axios.post('https://chat-with-mongoo-db-l2fr.vercel.app/api/auth/register', data);
        dispatch(registerSuccess());

        dispatch(setAuth(false));
    } catch (error) {
        message.error(error.response.data.msg);
        dispatch(registerFail());
    }
};

export const getRoomsRequest = async (user, dispatch, axios, navigate) => {
    dispatch(getRoomsStart());
    try {
        const response = await axios.get(`/room?_id=${user._id}`, {
            headers: {
                token: `Bearer ${user.accessToken}`,
            },
            withCredentials: true,
        });
        if (response.data.length === 0) {
            dispatch(getRoomsFail([]));
            return;
        }

        if (navigate) {
            navigate(`/room/${response.data[0]?._id}`);
        }
        dispatch(getRoomsSuccess(response.data));
        getChatRequest(user, dispatch, axios, response.data[0]?._id);
    } catch (error) {
        message.error(error.response.data.msg);
        dispatch(getRoomsFail([]));
    }
};

export const getChatRequest = async (user, dispatch, axios, id, page = 1, chat) => {
    dispatch(getChatStart());

    try {
        const response = await axios.get(`/message/${id}?page=${page}`, {
            headers: {
                token: `Bearer ${user.accessToken}`,
                _id: user._id,
            },
            withCredentials: true,
        });

        if (response.data.length === 0) {
            dispatch(getChatFail([]));
            return;
        }
        if (chat?.data) {
            setTimeout(() => {
                dispatch(getChatSuccess([...response.data, ...chat?.data]));
            }, 1000);
            return;
        }

        setTimeout(() => {
            dispatch(getChatSuccess(response.data));
        }, 1000);
    } catch (error) {
        message.error(error.response.data.msg);
        dispatch(getChatFail([]));
    }
};

export const sendMessageRequest = async (user, dispatch, data, id, axios) => {
    dispatch(sendMessageStart());
    try {
        await axios.post(`/message/${id}`, data, {
            headers: {
                token: `Bearer ${user.accessToken}`,
                _id: user._id,
            },
            withCredentials: true,
        });
        dispatch(sendMessageSuccess());
    } catch (error) {
        message.error(error.response.data.msg);
        dispatch(sendMessageFail());
    }
};

export const getProlifeRequest = async (_id, user_id, accessToken, axiosJWT, dispatch) => {
    dispatch(setProfileStart());

    try {
        const response = await axiosJWT.get(`/user/${_id}`, {
            headers: {
                token: `Bearer ${accessToken}`,
                _id: user_id,
            },
            withCredentials: true,
        });
        dispatch(setProfileSuccess(response.data));
    } catch (error) {
        dispatch(setProfileFail());
    }
};

export const changePasswordRequest = async (user, accessToken, dispatch, data, axios, setError, e) => {
    dispatch(setChangePasswordStart());
    try {
        await axios.put(`/user/${user._id}`, data, {
            headers: {
                token: `Bearer ${accessToken}`,
                _id: user._id,
            },
            withCredentials: true,
        });
        dispatch(setChangePasswordSuccess());
        message.success('Change password success');
        e.reset();
    } catch (error) {
        setError(error.response.data);
        dispatch(setChangePasswordFail());
    }
};

export const searchUserRequest = async (user, dispatch, data, axios) => {
    dispatch(getSearchStart());
    try {
        const response = await axios.get(`/search?keyword=${data}`, {
            headers: {
                token: `Bearer ${user.accessToken}`,
                _id: user._id,
            },
            withCredentials: true,
        });
        console.log(response.data);
        dispatch(getSearchSuccess(response.data));
    } catch (error) {
        message.error(error.response.data.msg);
        dispatch(getSearchFail());
    }
};

export const uploadImageRoomRequest = async (user, room, roomActive, dispatch, data, axios) => {
    try {
        const response = await axios.put(
            `/room/${room[roomActive]?._id}`,
            {
                avatar: data,
            },
            {
                headers: {
                    token: `Bearer ${user.accessToken}`,
                    _id: user._id,
                },
                withCredentials: true,
            },
        );

        message.success(response.data.msg);
    } catch (error) {
        message.error(error.response.data.msg);
    }
};
