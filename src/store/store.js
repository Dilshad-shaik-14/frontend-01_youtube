import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../utils/authSlice";
import videoReducer from "../utils/videoSlice";
import playlistReducer from "../utils/playListSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        video: videoReducer,
        playlist: playlistReducer

    }
});