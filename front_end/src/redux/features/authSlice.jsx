import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        login: {
            loading: false,
            error: false,
            data: null,
        },

        logout: {
            loading: false,
            error: false,
        },

        auth: false,

        register: {
            loading: false,
            error: false,
        },
    },
    reducers: {
        loginStart: (state) => {
            state.login.loading = true;
            state.login.error = false;
        },
        loginSuccess: (state, action) => {
            state.login.loading = false;
            state.login.data = action.payload;
            state.login.error = false;
        },
        loginFail: (state) => {
            state.login.loading = false;
            state.login.error = true;
        },

        setAuth: (state, action) => {
            state.auth = action.payload;
        },

        registerStart: (state) => {
            state.register.loading = true;
            state.register.error = false;
        },
        registerSuccess: (state) => {
            state.register.loading = false;
            state.register.error = false;
        },
        registerFail: (state) => {
            state.register.loading = false;
            state.register.error = true;
        },

        logoutStart: (state) => {
            state.logout.loading = true;
            state.logout.error = false;
        },
        logoutSuccess: (state) => {
            state.logout.loading = false;
            state.logout.error = false;
            state.login.data = null;
        },
        logoutFail: (state) => {
            state.logout.loading = false;
            state.logout.error = true;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFail,
    setAuth,
    registerStart,
    registerSuccess,
    registerFail,
    logoutStart,
    logoutSuccess,
    logoutFail,
} = authSlice.actions;

export default authSlice.reducer;
