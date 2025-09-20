import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: null,
}

const AuthSlicer = createSlice({
    name: "User",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userInfo = action.payload;
        },
        logout: (state) => {
            state.userInfo = null;
        }
    },
});

export const { setUser,logout } = AuthSlicer.actions;
export default AuthSlicer.reducer;