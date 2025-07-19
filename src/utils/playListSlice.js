import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  playlists: [],
  currentPlaylistId: null,
  isPlaylistOpen: false,
};

const playListSlice = createSlice({
  name: "playList",
  initialState,
  reducers: {
    setPlaylists: (state, action) => {
      state.playlists = action.payload;
    },

    addPlaylist: (state, action) => {
      state.playlists.push(action.payload);
    },

    removePlaylist: (state, action) => {
      state.playlists = state.playlists.filter(
        (p) => p._id !== action.payload
      );
    },

    setCurrentPlaylistId: (state, action) => {
      state.currentPlaylistId = action.payload;
    },

    togglePlaylist: (state) => {
      state.isPlaylistOpen = !state.isPlaylistOpen;
    },

    addVideoToPlaylist: (state, action) => {
      const { playlistId, video } = action.payload;
      const playlist = state.playlists.find((p) => p._id === playlistId);
      if (playlist && !playlist.videos.find((v) => v._id === video._id)) {
        playlist.videos.push(video);
      }
    },

    removeVideoFromPlaylistRedux: (state, action) => {
  const { playlistId, videoId } = action.payload;
  const playlist = state.playlists.find((p) => p._id === playlistId);
  if (playlist) {
    playlist.videos = playlist.videos.filter((v) => v._id !== videoId);
  }
},


    updatePlaylist: (state, action) => {
      const updated = action.payload;
      const index = state.playlists.findIndex((p) => p._id === updated._id);
      if (index !== -1) {
        state.playlists[index] = updated;
      }
    },

    reorderVideos: (state, action) => {
      const { playlistId, oldIndex, newIndex } = action.payload;
      const playlist = state.playlists.find((p) => p._id === playlistId);
      if (playlist && playlist.videos.length > 1) {
        const reordered = [...playlist.videos];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);
        playlist.videos = reordered;
      }
    },

    setPlaylistVideos: (state, action) => {
      const { playlistId, videos } = action.payload;
      const playlist = state.playlists.find((p) => p._id === playlistId);
      if (playlist) {
        playlist.videos = videos;
      }
    },

    resetPlaylistState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setPlaylists,
  addPlaylist,
  removePlaylist,
  setCurrentPlaylistId,
  togglePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylistRedux,
  updatePlaylist,
  reorderVideos,
  setPlaylistVideos,
  resetPlaylistState,
} = playListSlice.actions;

export default playListSlice.reducer;
