import axios from "axios";
import { form } from "framer-motion/client";

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


const refreshToken = () =>
    axios
        .post(`${baseURL}/users/refresh-token`, {}, { withCredentials: true })
        .then((response) => response.data);

const changePassword = (formData) =>
    axios   
        .post(`${baseURL}/users/change-password`, formData, {
            withCredentials: true,  
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then((response) => response.data);

const getCurrentUser = () =>
    axios   
        .get(`${baseURL}/users/current-user`, { withCredentials: true })
        .then((response) => response.data);

const updateAccount = (formData) =>
    axios
        .patch(`${baseURL}/users/update-account`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then((response) => response.data);

const avatarUpdate = (formData) =>
    axios
        .patch(`${baseURL}/users/avatar-update`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then((response) => response.data);

const coverImageUpdate = (formData) =>
    axios
        .patch(`${baseURL}/users/cover-image-update`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" }
        })
        .then((response) => response.data);

const getUserChannel = (username) =>
    axios   
        .get(`${baseURL}/users/c/${username}`, { withCredentials: true })
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