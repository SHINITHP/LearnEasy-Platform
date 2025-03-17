import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    userId: string;
    email: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    tokenExpiry: number | null;
}

const initialState: AuthState = {
    token: null,
    user: null,
    isAuthenticated: false,
    tokenExpiry: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<{ token: string; user: User }>) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.tokenExpiry = Date.now() + 15 * 60 * 1000;
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.tokenExpiry = null;
        },
    },
});

export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
