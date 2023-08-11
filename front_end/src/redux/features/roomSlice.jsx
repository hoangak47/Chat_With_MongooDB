import { createSlice } from '@reduxjs/toolkit';

export const roomSlice = createSlice({
    name: 'room',
    initialState: {
        rooms: {
            loading: false,
            error: false,
            data: [],
        },

        chat: {
            loading: false,
            error: false,
            data: [],
        },

        dataChat: [],

        message: {
            loading: false,
            error: false,
        },
    },
    reducers: {
        getRoomsStart: (state) => {
            state.rooms.loading = true;
            state.rooms.error = false;
        },
        getRoomsSuccess: (state, action) => {
            state.rooms.loading = false;
            state.rooms.error = false;
            state.rooms.data = action.payload;
        },
        getRoomsFail: (state) => {
            state.rooms.loading = false;
            state.rooms.error = true;
        },

        getChatStart: (state) => {
            state.chat.loading = true;
        },
        getChatSuccess: (state, action) => {
            state.chat.loading = false;
            state.chat.error = false;
            state.chat.data = action.payload;
        },
        getChatFail: (state) => {
            state.chat.loading = false;
            state.chat.error = true;
        },

        setDataChat: (state, action) => {
            state.dataChat = action.payload;
        },

        sendMessageStart: (state) => {
            state.message.loading = true;
            state.message.error = false;
        },
        sendMessageSuccess: (state, action) => {
            state.message.loading = false;
            state.message.error = false;
            state.chat.data = action.payload;
        },
        sendMessageFail: (state) => {
            state.message.loading = false;
            state.message.error = true;
        },
    },
});

export const {
    getRoomsStart,
    getRoomsSuccess,
    getRoomsFail,
    getChatStart,
    getChatSuccess,
    getChatFail,
    sendMessageStart,
    sendMessageSuccess,
    sendMessageFail,
    setDataChat,
} = roomSlice.actions;

export default roomSlice.reducer;
