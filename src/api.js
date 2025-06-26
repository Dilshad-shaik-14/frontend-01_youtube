import axios from "axios";

const baseURL = import.meta.env.VITE_URI;

export const login =(Credential) => 
    axios
        .post(`${baseURL}/users/login`, Credential,{ withCredentials: true })
        .then((response) => response.data);

export const register = (formData) =>
    axios
        .post(`${baseURL}/users/register`, formData , { 
            withCredentials: true,
             headers: { "Content-Type": "multipart/form-data" }
            }
        )
        .then((response) => response.data);

export const logout= () =>
    axios
        .get(`${baseURL}/users/logout`, {} , { withCredentials: true })
        .then((response) => response.data);

export const currentUser = () =>
    axios
        .get(`${baseURL}/users/current`, { withCredentials: true })
        .then((response) => response.data);

///
export const getAllVideos = (page) =>
    axios
        .get(`${baseURL}/videos?page=${page}`, { withCredentials: true })
        .then((response) => response.data);

export const getVideoById = (id) =>
    axios
        .get(`${baseURL}/videos/${id}`, { withCredentials: true })
        .then((response) => response.data);

export const publishVideo = (formData) =>
    axios
        .post(`${baseURL}/videos/`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then((response) => response.data);

export const updateVideo = (id, formData) =>
    axios
        .patch(`${baseURL}/videos/${id}`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then((response) => response.data);

export const deleteVideo = (id) =>
    axios
        .delete(`${baseURL}/videos/${id}`, { withCredentials: true })
        .then((response) => response.data);