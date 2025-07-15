import axios from "axios";

const baseURL = import.meta.env.VITE_URI;

const attachAuthToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};


const apiClient = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});


const apiClient2 = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "multipart/form-data" },
  withCredentials: true,
});


apiClient.interceptors.request.use(attachAuthToken, (error) => Promise.reject(error));
apiClient2.interceptors.request.use(attachAuthToken, (error) => Promise.reject(error));


const handleApiResponse = (apiCall) =>
  new Promise((resolve, reject) => {
    apiCall
      .then((res) => resolve(res.data))
      .catch((error) => {
        const errorMessage = error.response?.data?.message || "Unknown error";
        reject(errorMessage);
      });
  });


export const login = (credentials) =>
  handleApiResponse(apiClient.post(`/users/login`, credentials));

export const logout = () =>
  handleApiResponse(apiClient.post(`/users/logout`, {}));

export const register = (credentials) =>
  handleApiResponse(apiClient2.post(`/users/register`, credentials));

export const forgetPassword = (credentials) =>
  handleApiResponse(apiClient.post(`/users/forget-password`, { email: credentials.email }));

export const newPassword = (credentials) =>
  handleApiResponse(apiClient.post(`/users/new-password`, credentials));

export const refreshToken = () =>
  handleApiResponse(apiClient.post(`/users/refresh-token`, {}));

export const changePassword = (credentials) =>
  handleApiResponse(apiClient.post(`/users/change-password`, credentials));

export const currentUser = () =>
  handleApiResponse(apiClient.get(`/users/current-user`));

export const updateAccount = (credentials) =>
  handleApiResponse(apiClient.patch(`/users/update-account`, credentials));

export const updateAvatar = (credentials) =>
  handleApiResponse(apiClient2.patch(`/users/avatar-update`, credentials));

export const updateCoverImage = (credentials) =>
  handleApiResponse(apiClient2.patch(`/users/coverImage-update`, credentials));

export const getUserChannelProfile = (userName) =>
  handleApiResponse(apiClient.get(`/users/c/${userName}`));

export const getWatchHistory = () =>
  handleApiResponse(apiClient.get(`/users/watch-history`));

export const deleteHistory = () =>
  handleApiResponse(apiClient.delete(`/users/delete-watchhistory`));

export const deleteAvatar = () =>
  handleApiResponse(apiClient.delete(`/users/delete-avatar`));

export const deleteCoverImage = () =>
  handleApiResponse(apiClient.delete(`/users/delete-coverImage`));

export const getRegisteredUsers = ({ limit = 10, page = 1 }) =>
  handleApiResponse(apiClient.get(`/users/registered-users`, { params: { page, limit } }));

export const suggestUsers = () =>
  handleApiResponse(apiClient.get(`/users/suggestions`));

export const getAllVideos = ({ limit = 10, page = 1, query = null, username = null }) =>
  handleApiResponse(apiClient.get(`/videos/`, { params: { page, query, username, limit } }));

export const publishAVideo = (credentials) =>
  handleApiResponse(apiClient2.post(`/videos/`, credentials));

export const getVideoById = (videoId) =>
  handleApiResponse(apiClient.get(`/videos/${videoId}`));

export const getVideoDetails = (videoId) =>
  handleApiResponse(apiClient.get(`/videos/b/${videoId}`));

export const deleteVideo = (videoId) =>
  handleApiResponse(apiClient.delete(`/videos/${videoId}`));

export const updateVideo = (videoId, formData, onUploadProgress) =>
  handleApiResponse(apiClient2.patch(`/videos/${videoId}`, formData, { onUploadProgress }));

export const togglePublishStatus = (videoId) =>
  handleApiResponse(apiClient.patch(`/videos/toggle/publish/${videoId}`));

export const createTweet = (credentials) =>
  handleApiResponse(apiClient.post(`/tweets/`, credentials));

export const getTweets = ({ page = 1 }) =>
  handleApiResponse(apiClient.get(`/tweets/`, { params: { page } }));

export const getUserTweets = (userId) =>
  handleApiResponse(apiClient.get(`/tweets/user/${userId}`));

export const updateTweet = (tweetId, credentials) =>
  handleApiResponse(apiClient.patch(`/tweets/${tweetId}`, credentials));

export const deleteTweet = (tweetId) =>
  handleApiResponse(apiClient.delete(`/tweets/${tweetId}`));

export const getSubscribedChannels = (channelId) =>
  handleApiResponse(apiClient.get(`/subscriptions/c/${channelId}`));

export const toggleSubscription = (channelId) =>
  handleApiResponse(apiClient.post(`/subscriptions/c/${channelId}`));

export const getChannelSubscribers = (subscriberId) =>
  handleApiResponse(apiClient.get(`/subscriptions/u/${subscriberId}`));

export const createPlaylist = (credentials) =>
  handleApiResponse(apiClient.post(`/playlist`, credentials));

export const getPlaylistById = (playlistId) =>
  handleApiResponse(apiClient.get(`/playlist/${playlistId}`));

export const updatePlaylist = (playlistId, credentials) =>
  handleApiResponse(apiClient.patch(`/playlist/${playlistId}`, credentials));

export const deletePlaylist = (playlistId) =>
  handleApiResponse(apiClient.delete(`/playlist/${playlistId}`));

export const addVideoToPlaylist = (videoId, playlistId) =>
  handleApiResponse(apiClient.patch(`/playlist/add/${videoId}/${playlistId}`));

export const removeVideoFromPlaylist = (videoId, playlistId) =>
  handleApiResponse(apiClient.delete(`/playlist/remove/${videoId}/${playlistId}`));

export const getUserPlaylists = (userId) =>
  handleApiResponse(apiClient.get(`/playlist/user/${userId}`));

export const toggleVideoLike = (videoId) =>
  handleApiResponse(apiClient.post(`/likes/toggle/v/${videoId}`));

export const toggleCommentLike = (commentId) =>
  handleApiResponse(apiClient.post(`/likes/toggle/c/${commentId}`));

export const toggleTweetLike = (tweetId) =>
  handleApiResponse(apiClient.post(`/likes/toggle/t/${tweetId}`));

export const getLikedVideos = () =>
  handleApiResponse(apiClient.get(`/likes/videos`));

export const getLikedTweets = () =>
  handleApiResponse(apiClient.get('/likes/tweets'));

export const getLikedComments = () =>
  handleApiResponse(apiClient.get('/likes/comments'));


export const healthCheck = () =>
  handleApiResponse(apiClient.get(`/healthcheck`));

export const getChannelStats = (channel) =>
  handleApiResponse(apiClient.get(`/dashboard/stats/${channel}`));

export const getChannelVideos = (channel) =>
  handleApiResponse(apiClient.get(`/dashboard/videos/${channel}`));

export const getVideoComments = ({ videoId, page, limit = 10 }) =>
  handleApiResponse(apiClient.get(`/comments/${videoId}`, { params: { page, limit } }));

export const addComment = (videoId, content) =>
  apiClient.post(`/comments/${videoId}`, { content }); 

export const deleteComment = (commentId) =>
  handleApiResponse(apiClient.delete(`/comments/c/${commentId}`));

export const updateComment = (commentId, content) =>
  handleApiResponse(apiClient.patch(`/comments/c/${commentId}`, { content }));
