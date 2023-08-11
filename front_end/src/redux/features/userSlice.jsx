import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        changePassword: {
            loading: false,
            error: false,
        },

        profile: {
            loading: false,
            error: false,
            data: {},
        },
    },
    reducers: {
        setChangePasswordStart: (state) => {
            state.changePassword.loading = true;
            state.changePassword.error = false;
        },
        setChangePasswordSuccess: (state) => {
            state.changePassword.loading = false;
            state.changePassword.error = false;
        },
        setChangePasswordFail: (state) => {
            state.changePassword.loading = false;
            state.changePassword.error = true;
        },

        setProfileStart: (state) => {
            state.profile.loading = true;
            state.profile.error = false;
        },
        setProfileSuccess: (state, actions) => {
            state.profile.loading = false;
            state.profile.error = false;
            state.profile.data = actions.payload;
        },
        setProfileFail: (state) => {
            state.profile.loading = false;
            state.profile.error = true;
        },
    },
});

export const {
    setChangePasswordStart,
    setChangePasswordSuccess,
    setChangePasswordFail,
    setProfileStart,
    setProfileSuccess,
    setProfileFail,
} = userSlice.actions;

export default userSlice.reducer;
