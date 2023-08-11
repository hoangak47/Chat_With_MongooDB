const { createSlice } = require('@reduxjs/toolkit');

export const searchSlice = createSlice({
    name: 'searchSlice',
    initialState: {
        search: {
            data: [],
            loading: false,
            error: false,
        },
    },
    reducers: {
        getSearchStart: (state) => {
            state.search = {
                data: [],
                loading: true,
                error: false,
            };
        },
        getSearchSuccess: (state, action) => {
            state.search = {
                data: action.payload,
                loading: false,
                error: false,
            };
        },
        getSearchFail: (state) => {
            state.search = {
                data: [],
                loading: false,
                error: true,
            };
        },
    },
});

export const { getSearchStart, getSearchSuccess, getSearchFail } = searchSlice.actions;

export default searchSlice.reducer;
