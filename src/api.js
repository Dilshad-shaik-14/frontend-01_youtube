import axios from "axios";


const baseURL = import.meta.env.VITE_URI;

const apiClient2 = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
});

const apiClient = axios.create({
    baseURL : baseURL,
    headers:{
        'Content-Type' : 'application/json'
    }
})

const handleApiResponse = (apiCall) => {
    return new Promise((resolve, reject) => {
        apiCall
            .then((res) => resolve(res.data))
            .catch((error) => {
                const errorMessage = error.response?.data?.message;
                if (errorMessage) reject(errorMessage);
                else reject("unknown error");
            });
    });
};

export const login = (credentials) => handleApiResponse(
    apiClient.post(`${baseURL}/users/login`, {email : credentials.email , password : credentials.password} , {withCredentials:true})
);

export const logout = () => handleApiResponse(
    apiClient.post(`${baseURL}/users/logout` , {} , {withCredentials : true})
)

export const register = (credentials) => handleApiResponse(
    apiClient2.post(`${baseURL}/users/register` , credentials , {withCredentials : true})
);

export const forgetPassword = (credentials) => handleApiResponse(
    apiClient.post(`${baseURL}/users/forget-password`, {email : credentials.email}, { withCredentials: true })
);

export const newPassword = (credentials) => handleApiResponse(
    apiClient.post(`${baseURL}/users/new-password`, {...credentials}, { withCredentials: true })
);

export const refreshToken = () => handleApiResponse(
    apiClient.post(`${baseURL}/users/refresh-token`, {}, { withCredentials: true })
);

export const changePassword = (credentials) => handleApiResponse(
    apiClient.post(`${baseURL}/users/change-password`, {...credentials}, { withCredentials: true })
);

export const currentUser = () => handleApiResponse(
    apiClient.get(`${baseURL}/users/current-user`, { withCredentials: true })
);

export const updateAccount = (credentials) => handleApiResponse(
    apiClient.patch(`${baseURL}/users/update-account`, {...credentials}, { withCredentials: true })
);

export const updateAvatar = (credentials) => handleApiResponse(
    apiClient2.patch(`${baseURL}/users/update-avatar`, credentials, { withCredentials: true })
);

export const updateCoverImage = (credentials) => handleApiResponse(
    apiClient2.patch(`${baseURL}/users/update-coverImage`, credentials, { withCredentials: true })
);

export const getUserChannelProfile = (userName) => handleApiResponse(
    apiClient.get(`${baseURL}/users/c/${userName}`, { withCredentials: true })
);

export const getWatchHistory = () => handleApiResponse(
    apiClient.get(`${baseURL}/users/history`, { withCredentials: true })
);

export const deleteHistory = () => handleApiResponse(
    apiClient.delete(`${baseURL}/users/delete-history`, { withCredentials: true })
);

export const deleteAvatar = () => handleApiResponse(
    apiClient.delete(`${baseURL}/users/delete-avatar`, { withCredentials: true})
);

export const deleteCoverImage = () => handleApiResponse(
    apiClient.delete(`${baseURL}/users/delete-coverImage`, { withCredentials: true})
);

export const getRegisteredUsers = ({limit = 10,page = 1}) => handleApiResponse(
    apiClient.get(`${baseURL}/users/registered-users`, { withCredentials: true, params : {page , limit} })
);

export const getAllVideos = ({limit = 10 ,page=1 , query = null , userId = null}) => handleApiResponse(
    apiClient.get(`${baseURL}/videos/`, { withCredentials: true , params : {page , query , userId , limit}})
);

export const publishAVideo = (credentials) => handleApiResponse(
    apiClient2.post(`${baseURL}/videos/`, credentials, { withCredentials: true })
);

export const getVideoById = (videoId) => handleApiResponse(
    apiClient.get(`${baseURL}/videos/${videoId}`, { withCredentials: true })
);

export const getVideoDetails = (videoId) => handleApiResponse(
    apiClient.get(`${baseURL}/videos/b/${videoId}`,{withCredentials : true})
);

export const deleteVideo = (videoId) => handleApiResponse(
    apiClient.delete(`${baseURL}/videos/${videoId}`, { withCredentials: true })
);

export const updateVideo = (videoId, credentials) => handleApiResponse(
    apiClient2.patch(`${baseURL}/videos/${videoId}`, credentials, { withCredentials: true })
);

export const togglePublishStatus = (videoId) => handleApiResponse(
    apiClient.patch(`${baseURL}/videos/toggle/publish/${videoId}`, {}, { withCredentials: true })
);

export const createTweet = (credentials) => handleApiResponse(
    apiClient.post(`${baseURL}/tweets/`, {...credentials}, { withCredentials: true })
);

export const getTweets =  ({page = 1}) => handleApiResponse(
    apiClient.get(`${baseURL}/tweets/`, { withCredentials: true, params: {page} })
);

export const getUserTweets =  (userId) => handleApiResponse(
    apiClient.get(`${baseURL}/tweets/user/${userId}`, { withCredentials: true })
);

export const updateTweet =  (tweetId, credentials) => handleApiResponse(
    apiClient.patch(`${baseURL}/tweets/${tweetId}`, {...credentials}, { withCredentials: true })
);

export const deleteTweet =  (tweetId) => handleApiResponse(
    apiClient.delete(`${baseURL}/tweets/${tweetId}`, { withCredentials: true })
);

export const getSubscribedChannels = (channelId) => handleApiResponse(
    apiClient.get(`${baseURL}/subscriptions/c/${channelId}`, { withCredentials: true})
);

export const toggleSubscription =  (channelId) => handleApiResponse(
    apiClient.post(`${baseURL}/subscriptions/c/${channelId}`, {}, { withCredentials: true })
);

export const getChannelSubscribers = (subscriberId) => handleApiResponse(
    apiClient.get(`${baseURL}/subscriptions/u/${subscriberId}`, { withCredentials: true})
);

export const createPlaylist =  (credentials) => handleApiResponse(
    apiClient.post(`${baseURL}/playlist`, {...credentials}, { withCredentials: true })
);

export const getPlaylistById =  (playlistId) => handleApiResponse(
    apiClient.get(`${baseURL}/playlist/${playlistId}`, { withCredentials: true})
);

export const updatePlaylist =  (playlistId, credentials) => handleApiResponse(
    apiClient.patch(`${baseURL}/playlist/${playlistId}`, {...credentials}, { withCredentials: true })
);

export const deletePlaylist =  (playlistId) => handleApiResponse(
    apiClient.delete(`${baseURL}/playlist/${playlistId}`, { withCredentials: true})
);

export const addVideoToPlaylist =  (videoId, playlistId) => handleApiResponse(
    apiClient.patch(`${baseURL}/playlist/add/${videoId}/${playlistId}`, {}, { withCredentials: true })
);

export const removeVideoFromPlaylist =  (videoId, playlistId) => handleApiResponse(
    apiClient.patch(`${baseURL}/playlist/remove/${videoId}/${playlistId}`, {}, { withCredentials: true })
);

export const getUserPlaylists =  (userId) => handleApiResponse(
    apiClient.get(`${baseURL}/playlist/user/${userId}`, { withCredentials: true})
);

export const toggleVideoLike =  (videoId) => handleApiResponse(
    apiClient.post(`${baseURL}/likes/toggle/v/${videoId}`, {}, { withCredentials: true })
);

export const toggleCommentLike =  (commentId) => handleApiResponse(
    apiClient.post(`${baseURL}/likes/toggle/c/${commentId}`, {}, { withCredentials: true })
);

export const toggleTweetLike =  (tweetId) => handleApiResponse(
    apiClient.post(`${baseURL}/likes/toggle/t/${tweetId}`, {}, { withCredentials: true })
);

export const getLikedVideos =  () => handleApiResponse(
    apiClient.get(`${baseURL}/likes/videos`, { withCredentials: true})
);

export const healthCheck =  () => handleApiResponse(
    apiClient.get(`${baseURL}/healthcheck`, { withCredentials: true})
);

export const getChannelStats =  (channel) => handleApiResponse(
    apiClient.get(`${baseURL}/dashboard/stats/${channel}`, { withCredentials: true })
);

export const getChannelVideos =  (channel) => handleApiResponse(
    apiClient.get(`${baseURL}/dashboard/videos/${channel}`, { withCredentials: true})
);

export const getVideoComments =  ({videoId, page , limit = 10}) => handleApiResponse(
    apiClient.get(`${baseURL}/comments/${videoId}`, { withCredentials: true, params: {page , limit} })
);

export const addComment =  (videoId, credentials) => handleApiResponse(
    apiClient.post(`${baseURL}/comments/${videoId}`, {...credentials}, { withCredentials: true })
);

export const deleteComment =  (commentId) => handleApiResponse(
    apiClient.delete(`${baseURL}/comments/c/${commentId}`, { withCredentials: true })
);

export const updateComment =  (commentId, credentials) =>handleApiResponse(
    apiClient.patch(`${baseURL}/comments/c/${commentId}`,{...credentials}, { withCredentials: true })
);