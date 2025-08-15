import React, { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  logout,
  changeCurrentPassword,
  forgetPassword,
  resetPassword,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  deleteAvatar as apiDeleteAvatar,
  deleteCoverImage as apiDeleteCoverImage,
} from "../../Index/api";
import { currentUserSuccess, logoutSuccess } from "../../utils/authSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  // Tabs
  const tabs = ["Account", "Profile", "Password", "Security", "Logout"];
  const [activeTab, setActiveTab] = useState("Account");

  // States
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [accountForm, setAccountForm] = useState({
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || "",
  });
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetForm, setResetForm] = useState({
    token: "",
    password: "",
    confirmPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);

  // Handlers (unchanged, just toast notifications added)
  const handleLogout = async () => {
    try {
      await logout();
      dispatch(logoutSuccess());
      toast.success("Logged out successfully", { theme: "colored" });
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Logout failed", { theme: "colored" });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await changeCurrentPassword(passwordForm);
      toast.success("Password changed successfully", { theme: "colored" });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Password change failed", { theme: "colored" });
    }
  };

  const handleUpdateAccountDetails = async (e) => {
    e.preventDefault();
    if (!accountForm.fullName || !accountForm.email) {
      toast.error("Full name and email are required", { theme: "colored" });
      return;
    }
    try {
      const res = await updateAccountDetails(accountForm);
      dispatch(currentUserSuccess({ data: res.data }));
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Account details updated successfully", { theme: "colored" });
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Account update failed", { theme: "colored" });
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await forgetPassword({ email: forgotEmail });
      toast.success("Password reset email sent successfully", { theme: "colored" });
      setForgotEmail("");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to send reset email", { theme: "colored" });
    }
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(resetForm);
      toast.success("Password reset successfully", { theme: "colored" });
      setResetForm({ token: "", password: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to reset password", { theme: "colored" });
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    if (!avatarFile) {
      toast.error("Please select an avatar image file", { theme: "colored" });
      return;
    }
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      const res = await updateAvatar(formData);
      dispatch(currentUserSuccess({ data: res.data }));
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Avatar updated successfully", { theme: "colored" });
      setAvatarFile(null);
      e.target.reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to update avatar", { theme: "colored" });
    }
  };

  const handleCoverImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImageFile(e.target.files[0]);
    }
  };

  const handleCoverImageUpload = async (e) => {
    e.preventDefault();
    if (!coverImageFile) {
      toast.error("Please select a cover image file", { theme: "colored" });
      return;
    }
    try {
      const formData = new FormData();
      formData.append("coverImage", coverImageFile);
      const res = await updateCoverImage(formData);
      dispatch(currentUserSuccess({ data: res.data.user || res.data }));
      localStorage.setItem("user", JSON.stringify(res.data.user || res.data));
      toast.success("Cover image updated successfully", { theme: "colored" });
      setCoverImageFile(null);
      e.target.reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to update cover image", { theme: "colored" });
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const res = await apiDeleteAvatar();
      dispatch(currentUserSuccess({ data: res.data }));
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Avatar deleted successfully", { theme: "colored" });
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to delete avatar", { theme: "colored" });
    }
  };

  const handleDeleteCoverImage = async () => {
    try {
      const res = await apiDeleteCoverImage();
      dispatch(currentUserSuccess({ data: res.data }));
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Cover image deleted successfully", { theme: "colored" });
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to delete cover image", { theme: "colored" });
    }
  };

  // Animation
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-start bg-[#0f0f0f] text-white">
      <div className="w-full max-w-3xl flex flex-col pt-4 px-2 md:px-0">
        {/* Tabs Navigation */}
        <nav className="flex flex-row border-b-4 border-[#FF0000] mb-0 space-x-2 bg-[#181818] rounded-t-xl">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium rounded-t-lg transition-colors duration-200
                ${activeTab === tab ? "bg-[#FF0000] text-white" : "bg-transparent text-gray-300 hover:bg-[#222]"}
              `}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Mobile Tabs */}
        <nav className="md:hidden flex overflow-x-auto space-x-2 mb-0 mt-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium
                ${activeTab === tab ? "bg-[#FF0000] text-white" : "bg-[#222] text-gray-300"}
              `}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-start items-stretch mt-0 pt-6">
          {activeTab === "Account" && (
            <motion.form
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleUpdateAccountDetails}
              className="space-y-4 bg-[#181818] p-6 rounded-b-xl shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-2 text-[#FF0000]">Update Account</h3>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 rounded-lg bg-[#121212] border border-[#FF0000] mb-2 text-white"
                value={accountForm.fullName}
                onChange={(e) =>
                  setAccountForm({ ...accountForm, fullName: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded-lg bg-[#121212] border border-[#FF0000] mb-2 text-white"
                value={accountForm.email}
                onChange={(e) =>
                  setAccountForm({ ...accountForm, email: e.target.value })
                }
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-[#FF0000] hover:bg-[#e60000] p-3 rounded-lg font-semibold mt-2 text-white"
              >
                Update Account
              </motion.button>
            </motion.form>
          )}

          {activeTab === "Profile" && (
            <>
              {/* Avatar */}
              <motion.form
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleAvatarUpload}
                className="space-y-4 bg-[#181818] p-6 rounded-b-xl shadow-lg mb-6"
                encType="multipart/form-data"
              >
                <h3 className="text-xl font-semibold flex justify-between items-center mb-2 text-[#FF0000]">
                  Update Avatar
                  <button
                    type="button"
                    onClick={handleDeleteAvatar}
                    className="text-sm bg-[#FF0000] hover:bg-[#e60000] px-3 py-1 rounded-lg font-semibold text-white"
                  >
                    Delete Avatar
                  </button>
                </h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full p-2 rounded-lg bg-[#121212] border border-[#FF0000] mb-2 text-white"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-[#FF0000] hover:bg-[#e60000] p-3 rounded-lg font-semibold mt-2 text-white"
                >
                  Upload Avatar
                </motion.button>
              </motion.form>

              {/* Cover Image */}
              <motion.form
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleCoverImageUpload}
                className="space-y-4 bg-[#181818] p-6 rounded-b-xl shadow-lg"
                encType="multipart/form-data"
              >
                <h3 className="text-xl font-semibold flex justify-between items-center mb-2 text-[#FF0000]">
                  Update Cover Image
                  <button
                    type="button"
                    onClick={handleDeleteCoverImage}
                    className="text-sm bg-[#FF0000] hover:bg-[#e60000] px-3 py-1 rounded-lg font-semibold text-white"
                  >
                    Delete Cover Image
                  </button>
                </h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="w-full p-2 rounded-lg bg-[#121212] border border-[#FF0000] mb-2 text-white"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-[#FF0000] hover:bg-[#e60000] p-3 rounded-lg font-semibold mt-2 text-white"
                >
                  Upload Cover Image
                </motion.button>
              </motion.form>
            </>
          )}

          {activeTab === "Password" && (
            <motion.form
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleChangePassword}
              className="space-y-4 bg-[#181818] p-6 rounded-b-xl shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-2 text-[#FF0000]">Change Password</h3>
              <input
                type="password"
                placeholder="Current Password"
                className="w-full p-3 rounded-lg bg-[#121212] border border-[#FF0000] mb-2 text-white"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full p-3 rounded-lg bg-[#121212] border border-[#FF0000] mb-2 text-white"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-3 rounded-lg bg-[#121212] border border-[#FF0000] mb-2 text-white"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-[#FF0000] hover:bg-[#e60000] p-3 rounded-lg font-semibold mt-2 text-white"
              >
                Change Password
              </motion.button>
            </motion.form>
          )}

          {activeTab === "Security" && (
            <>
              {/* Forgot Password */}
              <motion.form
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleForgotPassword}
                className="space-y-4 bg-[#181818] p-6 rounded-b-xl shadow-lg mb-6"
              >
                <h3 className="text-xl font-semibold mb-2 text-[#FF0000]">Forgot Password</h3>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3 rounded-lg bg-[#121212] border border-[#FF0000] mb-2 text-white"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-[#FF0000] hover:bg-[#e60000] p-3 rounded-lg font-semibold mt-2 text-white"
                >
                  Send Reset Email
                </motion.button>
              </motion.form>

              {/* Reset Password */}
              <motion.form
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleNewPassword}
                className="space-y-4 bg-[#181818] p-6 rounded-b-xl shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-2 text-[#FF0000]">Set New Password</h3>
                <input
                  type="text"
                  placeholder="Reset Token"
                  className="w-full p-3 rounded-lg bg-[#121212] border border-[#FF0000] mb-2 text-white"
                  value={resetForm.token}
                  onChange={(e) =>
                    setResetForm({ ...resetForm, token: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full p-3 rounded-lg bg-[#121212] border border-[#FF0000] mb-2 text-white"
                  value={resetForm.password}
                  onChange={(e) =>
                    setResetForm({ ...resetForm, password: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full p-3 rounded-lg bg-[#121212] border border-[#FF0000] mb-2 text-white"
                  value={resetForm.confirmPassword}
                  onChange={(e) =>
                    setResetForm({ ...resetForm, confirmPassword: e.target.value })
                  }
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-[#FF0000] hover:bg-[#e60000] p-3 rounded-lg font-semibold mt-2 text-white"
                >
                  Update Password
                </motion.button>
              </motion.form>
            </>
          )}

          {activeTab === "Logout" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center bg-[#181818] p-6 rounded-b-xl shadow-lg"
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-[#FF0000] hover:bg-[#e60000] p-3 rounded-lg font-semibold w-full mt-2 text-white"
              >
                Logout
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
