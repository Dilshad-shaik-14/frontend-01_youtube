import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "./pages/home/Home";
import VideoDetail from "./pages/video/videoDetails";
import TweetDetail from "./pages/Tweets/TweetDetail";
import Login from "./pages/Login";
//import Profile from "./pages/Profilepage/Profile";
import Subscriptions from "./pages/Subscriptions";
import MyUploads from "./pages/MyUploads";
import Layout from "./layout/Layout";
import Upload from "./pages/Upload";
import Like from './pages/Likes/Like';
import PlaylistsPage from "./pages/Playlist/PlaylistPage";
//import Explore from "../src/pages/Explore";
//import Settings from "../src/pages/Settings";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace/>;
};



const AppRoutes = () => {

  const currentUser = useSelector((state) => state.auth.currentUser);
  const userId = currentUser?._id;
  const userName = currentUser?.userName;

  console.log("currentUser from Redux:", currentUser);
  console.log("userId:", currentUser?._id);
  console.log("userName:", currentUser?.userName);

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

        {/*
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />*/}

        <Route
          path="/playlists"
          element={
            <ProtectedRoute>
              <PlaylistsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute>
              <Subscriptions userId={currentUser?._id} />
            </ProtectedRoute>
          }
        />

       {currentUser ? (
          <Route
            path="/myuploads"
            element={
            <ProtectedRoute>
            <MyUploads
              userId={currentUser._id}
              userName={currentUser.userName}
            />
            </ProtectedRoute>
            }
            />
            ) : null}

        <Route
          path="/uploads"
          element = {
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/likes"
          element={
            <ProtectedRoute>
              <Like />
            </ProtectedRoute>
          }
        />
{/*
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
