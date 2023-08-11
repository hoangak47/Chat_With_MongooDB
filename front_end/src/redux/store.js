import { configureStore } from '@reduxjs/toolkit';

import authReducer from './features/authSlice';
import roomReducer from './features/roomSlice';
import userReducer from './features/userSlice';
import searchReducer from './features/searchSlice';

export default configureStore({
    reducer: {
        auth: authReducer,
        room: roomReducer,
        user: userReducer,
        search: searchReducer,
    },
});
