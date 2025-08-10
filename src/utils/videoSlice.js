import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentVideo: null,
  isPlaying: false,
  volume: 1,
  isMuted: false,
  playbackRate: 1.0,
  playbackTime: 0,
  totalDuration: 0,
  isFullScreen: false,
  hasEnded: false,
  isBuffering: false,

  // Upload related state
  isUploading: false,
  uploadProgress: 0,
  uploadError: null,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setCurrentVideo: (state, action) => {
      state.currentVideo = action.payload;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    setPlaybackRate: (state, action) => {
      state.playbackRate = action.payload;
    },
    setPlaybackTime: (state, action) => {
      state.playbackTime = action.payload;
    },
    setTotalDuration: (state, action) => {
      state.totalDuration = action.payload;
    },
    toggleFullScreen: (state) => {
      state.isFullScreen = !state.isFullScreen;
    },
    resetVideoState: (state) => {
      Object.assign(state, initialState);
    },
    setHasEnded: (state, action) => {
      state.hasEnded = action.payload;
    },
    setIsBuffering: (state, action) => {
      state.isBuffering = action.payload;
    },

    // Upload actions
    setIsUploading: (state, action) => {
      state.isUploading = action.payload;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    setUploadError: (state, action) => {
      state.uploadError = action.payload;
    },
  },
});

export const {
  setCurrentVideo,
  togglePlay,
  setVolume,
  toggleMute,
  setPlaybackRate,
  setPlaybackTime,
  setTotalDuration,
  toggleFullScreen,
  resetVideoState,
  setHasEnded,
  setIsBuffering,

  setIsUploading,
  setUploadProgress,
  setUploadError,
} = videoSlice.actions;

export default videoSlice.reducer;
