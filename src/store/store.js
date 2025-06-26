import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import videoReducer from "../features/videoSlice";
import playlistReducer from "../features/playlistSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        video: videoReducer,
        playlist: playlistReducer

    }
});