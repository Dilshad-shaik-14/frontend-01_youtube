import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "../src/pages/Home";
import VideoDetail from "../src/pages/videoDetails";
import TweetDetail from "../src/pages/TweetDetail";
import Login from "../src/pages/Login";
import Profile from "../src/pages/Profile";
import Playlists from "../src/pages/Playlist";
import Subscriptions from "../src/pages/Subscriptions";
import MyUploads from "../src/pages/MyUploads";
import Layout from "./layout/Layout";
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
          path="/uploads"
          element={
            <ProtectedRoute>
              <MyUploads />
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
