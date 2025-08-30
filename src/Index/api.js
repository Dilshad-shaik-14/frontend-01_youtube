import axios from "axios";

const baseURL = import.meta.env.VITE_URI;

const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const apiClient2 = axios.create({
  baseURL,
  headers: { "Content-Type": "multipart/form-data" },
  withCredentials: true,
});

const attachAuthToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

apiClient.interceptors.request.use(attachAuthToken, (error) => Promise.reject(error));
apiClient2.interceptors.request.use(attachAuthToken, (error) => Promise.reject(error));

const handleApiResponse = (apiCall) =>
  new Promise((resolve, reject) => {
    apiCall
      .then((res) => resolve(res.data))
      .catch((error) => reject(error.response?.data?.message || "Unknown error"));
  });

// Auth
export const login = (credentials) =>
  handleApiResponse(apiClient.post(`/api/v1/users/login`, credentials));
export const register = (credentials) =>
  handleApiResponse(apiClient2.post(`/api/v1/users/register`, credentials));
export const logout = () =>
  handleApiResponse(apiClient.post(`/api/v1/users/logout`, {}));
export const forgetPassword = (credentials) =>
  handleApiResponse(apiClient.post(`/api/v1/users/forget-password`, { email: credentials.email }));
export const resetPassword = (credentials) =>
  handleApiResponse(apiClient.post(`/api/v1/users/reset-password`, credentials));
export const refreshToken = () =>
  handleApiResponse(apiClient.post(`/api/v1/users/refresh-token`, {}));
export const changeCurrentPassword = (credentials) =>
  handleApiResponse(apiClient.post(`/api/v1/users/change-password`, credentials));
export const currentUser = () =>
  handleApiResponse(apiClient.get(`/api/v1/users/current-user`));
export const updateAccountDetails = (credentials) =>
  handleApiResponse(apiClient.patch(`/api/v1/users/update-account`, credentials));
export const updateAvatar = (credentials) =>
  handleApiResponse(apiClient2.patch(`/api/v1/users/avatar-update`, credentials));
export const updateCoverImage = (credentials) =>
  handleApiResponse(apiClient2.patch(`/api/v1/users/coverImage-update`, credentials));
export const getUserChannelProfile = (userName) => {
  const cleanUserName = userName.replace(/[\r\n\s]+/g, "");
  return handleApiResponse(apiClient.get(`/api/v1/users/c/${cleanUserName}`));
};

export const getWatchHistory = () =>
  handleApiResponse(apiClient.get(`/api/v1/users/watch-history`));
export const deleteHistory = () =>
  handleApiResponse(apiClient.delete(`/api/v1/users/delete-watchhistory`));
export const deleteAvatar = () =>
  handleApiResponse(apiClient.delete(`/api/v1/users/delete-avatar`));
export const deleteCoverImage = () =>
  handleApiResponse(apiClient.delete(`/api/v1/users/delete-coverImage`));
export const getRegisteredUsers = ({ limit = 10, page = 1 }) =>
  handleApiResponse(apiClient.get(`/api/v1/users/registered-users`, { params: { page, limit } }));
export const suggestUsers = () =>
  handleApiResponse(apiClient.get(`/api/v1/users/suggestions`));

// Videos
export const getAllVideos = ({ limit = 10, page = 1, query = null, username = null }) =>
  handleApiResponse(apiClient.get(`/api/v1/videos/`, { params: { page, query, username, limit } }));
export const publishAVideo = (credentials) =>
  handleApiResponse(apiClient2.post(`/api/v1/videos/`, credentials));
export const getVideoById = (videoId) =>
  handleApiResponse(apiClient.get(`/api/v1/videos/${videoId}`));
export const getVideoByTitle = (title) =>
  handleApiResponse(apiClient.get(`/api/v1/videos/title/${encodeURIComponent(title)}`));
export const getVideoDetails = (videoId) =>
  handleApiResponse(apiClient.get(`/api/v1/videos/details/${videoId}`));
export const deleteVideo = (videoId) =>
  handleApiResponse(apiClient.delete(`/api/v1/videos/${videoId}`));
export const updateVideo = (id, formData, onUploadProgress) =>
  handleApiResponse(apiClient2.patch(`/api/v1/videos/${id}`, formData, { onUploadProgress }));
export const togglePublishStatus = (videoId) =>
  handleApiResponse(apiClient.patch(`/api/v1/videos/toggle/publish/${videoId}`));

// Tweets
export const createTweet = (credentials) =>
  handleApiResponse(apiClient.post(`/api/v1/tweets/`, credentials));
export const getTweets = ({ page = 1 }) =>
  handleApiResponse(apiClient.get(`/api/v1/tweets/`, { params: { page } }));
export const getUserTweets = (userId) =>
  handleApiResponse(apiClient.get(`/api/v1/tweets/user/${userId}`));
export const updateTweet = (tweetId, credentials) =>
  handleApiResponse(apiClient.patch(`/api/v1/tweets/${tweetId}`, credentials));
export const deleteTweet = (tweetId) =>
  handleApiResponse(apiClient.delete(`/api/v1/tweets/${tweetId}`));
export const getAllTweets = ({ page = 1, limit = 10 }) =>
  handleApiResponse(apiClient.get(`/api/v1/tweets/`, { params: { page, limit } }));

// Subscriptions
export const toggleSubscription = (channelId) =>
  handleApiResponse(apiClient.post(`/api/v1/subscriptions/toggle/${channelId}`));
export const getSubscribedChannels = (userId) =>
  handleApiResponse(apiClient.get(`/api/v1/subscriptions/user/${userId}/channels`));
export const getChannelSubscribers = (channelId) =>
  handleApiResponse(apiClient.get(`/api/v1/subscriptions/channel/${channelId}/subscribers`));

// Playlist
export const getPlaylistById = (playlistId) =>
  handleApiResponse(apiClient.get(`/api/v1/playlist/${playlistId}`));
export const createPlaylist = (data, isMultipart = false) =>
  handleApiResponse(apiClient2.post(`/api/v1/playlist`, data, { headers: isMultipart ? {} : {} }));
export const updatePlaylist = (id, data, isMultipart = false) =>
  handleApiResponse(apiClient2.patch(`/api/v1/playlist/${id}`, data, { headers: isMultipart ? {} : {} }));
export const deletePlaylist = (playlistId) =>
  handleApiResponse(apiClient.delete(`/api/v1/playlist/${playlistId}`));
export const addVideoToPlaylist = (videoId, playlistId) =>
  handleApiResponse(apiClient.patch(`/api/v1/playlist/add/${videoId}/${playlistId}`));
export const removeVideoFromPlaylist = (videoId, playlistId) =>
  handleApiResponse(apiClient.delete(`/api/v1/playlist/remove/${videoId}/${playlistId}`));
export const getUserPlaylists = (userId) =>
  handleApiResponse(apiClient.get(`/api/v1/playlist/user/${userId}`));

// Likes
export const toggleVideoLike = (videoId) =>
  handleApiResponse(apiClient.post(`/api/v1/likes/toggle/v/${videoId}`));
export const toggleCommentLike = (commentId) =>
  handleApiResponse(apiClient.post(`/api/v1/likes/toggle/c/${commentId}`));
export const toggleTweetLike = (tweetId) =>
  handleApiResponse(apiClient.post(`/api/v1/likes/toggle/t/${tweetId}`));
export const getLikedVideos = () =>
  handleApiResponse(apiClient.get(`/api/v1/likes/videos`));
export const getLikedTweets = () =>
  handleApiResponse(apiClient.get(`/api/v1/likes/tweets`));
export const getLikedComments = () =>
  handleApiResponse(apiClient.get(`/api/v1/likes/comments`));

// Dashboard & Comments
export const healthCheck = () =>
  handleApiResponse(apiClient.get(`/api/v1/healthcheck`));
export const getChannelStats = (channel) =>
  handleApiResponse(apiClient.get(`/api/v1/dashboard/stats/${channel}`));
export const getChannelVideos = (channel) =>
  handleApiResponse(apiClient.get(`/api/v1/dashboard/videos/${channel}`));
export const getVideoComments = ({ videoId, page, limit = 10 }) =>
  handleApiResponse(apiClient.get(`/api/v1/comments/${videoId}`, { params: { page, limit } }));
export const addComment = (videoId, content) =>
  handleApiResponse(apiClient.post(`/api/v1/comments/${videoId}`, { content }));
export const deleteComment = (commentId) =>
  handleApiResponse(apiClient.delete(`/api/v1/comments/c/${commentId}`));
export const updateComment = (commentId, content) =>
  handleApiResponse(apiClient.patch(`/api/v1/comments/c/${commentId}`, { content }));
