import { configureStore } from "@reduxjs/toolkit";
import apiSlice from "../api/apiSlice";
import authReducer from "./features/authSlice";
import storage from "redux-persist/lib/storage"; 
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
    key: "auth",
    storage,
    whitelist: ["token", "user", "isAuthenticated"],  // Only persist necessary auth data
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,  // Avoid errors with non-serializable values in RTK Query
        }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);  // Required for Redux Persist

// Define types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
