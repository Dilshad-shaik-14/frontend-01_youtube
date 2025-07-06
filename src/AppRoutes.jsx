import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "./pages/home/Home";
import VideoDetail from "./pages/video/videoDetails";
import TweetDetail from "./pages/Tweets/TweetDetail";
import Login from "./pages/Login";
import Profile from "./pages/Profilepage/Profile";
import Playlists from "./pages/Playlist/Playlist";
import Subscriptions from "./pages/Subscriptions";
import MyUploads from "./pages/MyUploads";
import Layout from "./layout/Layout";
import Upload from "./pages/Upload";
//import Explore from "../src/pages/Explore";
//import Settings from "../src/pages/Settings";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Layout with Sidebar & Navbar */}
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/video/:id"
          element={
            <ProtectedRoute>
              <VideoDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tweet/:id"
          element={
            <ProtectedRoute>
              <TweetDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/playlists"
          element={
            <ProtectedRoute>
              <Playlists />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute>
              <Subscriptions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/myuploads"
          element={
            <ProtectedRoute>
              <MyUploads />
            </ProtectedRoute>
          }
        />

        <Route
          path="/uploads"
          element = {
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
{/*
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        */}
      </Route> 

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
