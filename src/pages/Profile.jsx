import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Profile/Header";
import Tabs from "../components/Profile/Tabs";
import EditProfileModal from "../components/Profile/EditProfileModal";
import { useSelector } from "react-redux";

export default function Profile() {
  const { id } = useParams();
  const loggedInUser = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const isOwnProfile = loggedInUser?._id === id;

  useEffect(() => {
    axios.get(`/users/${id}`).then((res) => setUser(res.data));
  }, [id]);

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    if (isOwnProfile) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  if (!user) return <div className="text-center text-zinc-500">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Header user={user} />
      {isOwnProfile && (
        <div className="text-right mb-4">
          <button
            onClick={() => setShowEditModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit Profile
          </button>
        </div>
      )}
      <Tabs userId={user._id} />

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}
