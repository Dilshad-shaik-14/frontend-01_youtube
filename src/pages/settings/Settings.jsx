import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  const tabs = ["Account", "Profile", "Password", "Security", "Logout"];
  const [activeTab, setActiveTab] = useState("Account");

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

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(logoutSuccess());
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Logout failed");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await changeCurrentPassword(passwordForm);
      toast.success("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Password change failed");
    }
  };

  const handleUpdateAccountDetails = async (e) => {
    e.preventDefault();
    if (!accountForm.fullName || !accountForm.email) {
      toast.error("Full name and email are required");
      return;
    }
    try {
      const res = await updateAccountDetails(accountForm);
      dispatch(currentUserSuccess({ data: res.data }));
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Account details updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Account update failed");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await forgetPassword({ email: forgotEmail });
      toast.success("Password reset email sent successfully");
      setForgotEmail("");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to send reset email");
    }
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(resetForm);
      toast.success("Password reset successfully");
      setResetForm({ token: "", password: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to reset password");
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) setAvatarFile(e.target.files[0]);
  };
  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    if (!avatarFile) {
      toast.error("Please select an avatar image file");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      const res = await updateAvatar(formData);
      dispatch(currentUserSuccess({ data: res.data }));
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Avatar updated successfully");
      setAvatarFile(null);
      e.target.reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to update avatar");
    }
  };

  const handleCoverImageChange = (e) => {
    if (e.target.files && e.target.files[0]) setCoverImageFile(e.target.files[0]);
  };
  const handleCoverImageUpload = async (e) => {
    e.preventDefault();
    if (!coverImageFile) {
      toast.error("Please select a cover image file");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("coverImage", coverImageFile);
      const res = await updateCoverImage(formData);
      dispatch(currentUserSuccess({ data: res.data.user || res.data }));
      localStorage.setItem("user", JSON.stringify(res.data.user || res.data));
      toast.success("Cover image updated successfully");
      setCoverImageFile(null);
      e.target.reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to update cover image");
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const res = await apiDeleteAvatar();
      dispatch(currentUserSuccess({ data: res.data }));
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Avatar deleted successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to delete avatar");
    }
  };

  const handleDeleteCoverImage = async () => {
    try {
      const res = await apiDeleteCoverImage();
      dispatch(currentUserSuccess({ data: res.data }));
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Cover image deleted successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to delete cover image");
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="settings-container">
      <div className="settings-wrapper">
        <div className="w-full min-h-screen flex flex-col items-start justify-start bg-base-100 text-base-content px-3 sm:px-4 md:px-6 lg:px-8 py-6">
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="w-full max-w-3xl flex flex-col space-y-6">

        {/* Tabs: horizontally scrollable on small screens */}
        <div className="tabs tabs-boxed flex-nowrap overflow-x-auto no-scrollbar gap-2 mb-4 px-2">
          {tabs.map((tab) => (
            <a
              key={tab}
              className={`tab tab-lg cursor-pointer whitespace-nowrap rounded-full ${activeTab === tab ? "tab-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </a>
          ))}
        </div>

        {/* Account Tab */}
        {activeTab === "Account" && (
          <motion.form
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleUpdateAccountDetails}
            className="card bg-base-200 p-5 sm:p-6 rounded-xl shadow-md space-y-4 w-full"
          >
            <h3 className="text-lg sm:text-xl font-bold text-error">Update Account</h3>
            <input
              type="text"
              placeholder="Full Name"
              className="input input-bordered w-full rounded-full"
              value={accountForm.fullName}
              onChange={(e) => setAccountForm({ ...accountForm, fullName: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full rounded-full"
              value={accountForm.email}
              onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn btn-error w-full rounded-full"
            >
              Update Account
            </motion.button>
          </motion.form>
        )}

        {/* Profile Tab */}
        {activeTab === "Profile" && (
          <>
            <motion.form
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleAvatarUpload}
              encType="multipart/form-data"
              className="card bg-base-200 p-5 sm:p-6 rounded-xl shadow-md space-y-4 w-full"
            >
              <h3 className="text-lg sm:text-xl font-bold text-error flex justify-between items-center">
                Update Avatar
                <button
                  type="button"
                  className="btn btn-sm btn-error rounded-full"
                  onClick={handleDeleteAvatar}
                >
                  Delete
                </button>
              </h3>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full rounded-full"
                onChange={handleAvatarChange}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="btn btn-error w-full rounded-full"
              >
                Upload Avatar
              </motion.button>
            </motion.form>

            <motion.form
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleCoverImageUpload}
              encType="multipart/form-data"
              className="card bg-base-200 p-5 sm:p-6 rounded-xl shadow-md space-y-4 w-full"
            >
              <h3 className="text-lg sm:text-xl font-bold text-error flex justify-between items-center">
                Update Cover Image
                <button
                  type="button"
                  className="btn btn-sm btn-error rounded-full"
                  onClick={handleDeleteCoverImage}
                >
                  Delete
                </button>
              </h3>
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full rounded-full"
                onChange={handleCoverImageChange}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="btn btn-error w-full rounded-full"
              >
                Upload Cover Image
              </motion.button>
            </motion.form>
          </>
        )}

        {/* Password Tab */}
        {activeTab === "Password" && (
          <motion.form
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleChangePassword}
            className="card bg-base-200 p-5 sm:p-6 rounded-xl shadow-md space-y-4 w-full"
          >
            <h3 className="text-lg sm:text-xl font-bold text-error">Change Password</h3>
            <input
              type="password"
              placeholder="Current Password"
              className="input input-bordered w-full rounded-full"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            />
            <input
              type="password"
              placeholder="New Password"
              className="input input-bordered w-full rounded-full"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="input input-bordered w-full rounded-full"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn btn-error w-full rounded-full"
            >
              Change Password
            </motion.button>
          </motion.form>
        )}

        {/* Security Tab */}
        {activeTab === "Security" && (
          <>
            <motion.form
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleForgotPassword}
              className="card bg-base-200 p-5 sm:p-6 rounded-xl shadow-md space-y-4 w-full"
            >
              <h3 className="text-lg sm:text-xl font-bold text-error">Forgot Password</h3>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full rounded-full"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="btn btn-error w-full rounded-full"
              >
                Send Reset Email
              </motion.button>
            </motion.form>

            <motion.form
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleNewPassword}
              className="card bg-base-200 p-5 sm:p-6 rounded-xl shadow-md space-y-4 w-full"
            >
              <h3 className="text-lg sm:text-xl font-bold text-error">Set New Password</h3>
              <input
                type="text"
                placeholder="Reset Token"
                className="input input-bordered w-full rounded-full"
                value={resetForm.token}
                onChange={(e) => setResetForm({ ...resetForm, token: e.target.value })}
              />
              <input
                type="password"
                placeholder="New Password"
                className="input input-bordered w-full rounded-full"
                value={resetForm.password}
                onChange={(e) => setResetForm({ ...resetForm, password: e.target.value })}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="input input-bordered w-full rounded-full"
                value={resetForm.confirmPassword}
                onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="btn btn-error w-full rounded-full"
              >
                Update Password
              </motion.button>
            </motion.form>
          </>
        )}

        {/* Logout Tab */}
        {activeTab === "Logout" && (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="card bg-base-200 p-5 sm:p-6 rounded-xl shadow-md text-center w-full"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="btn btn-error w-full rounded-full"
            >
              Logout
            </motion.button>
          </motion.div>
        )}

      </div>
    </div>
    </div>
    </div>

  );
};

export default Settings;
