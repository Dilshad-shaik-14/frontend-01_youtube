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
} from "../../Index/api";
import { currentUserSuccess, logoutSuccess } from "../../utils/authSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  // Existing states
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

  // New states for files
  const [avatarFile, setAvatarFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);

  // Logout
  const handleLogout = async () => {
    try {
      await logout();
      dispatch(logoutSuccess());
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Logout failed");
    }
  };

  // Change password
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

  // Update account details
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

  // Forgot password
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

  // New password after reset
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

  // Handle avatar file selection
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  // Submit avatar update
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
      // Update redux and localStorage with new user data
      dispatch(currentUserSuccess({ data: res.data }));
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Avatar updated successfully");
      setAvatarFile(null);
      // Clear file input (optional)
      e.target.reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to update avatar");
    }
  };

  // Handle cover image file selection
  const handleCoverImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImageFile(e.target.files[0]);
    }
  };

  // Submit cover image update
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
      dispatch(currentUserSuccess({ data: res.data.user || res.data })); // you returned { user } in response
      localStorage.setItem("user", JSON.stringify(res.data.user || res.data));
      toast.success("Cover image updated successfully");
      setCoverImageFile(null);
      e.target.reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to update cover image");
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#0F0F0F] text-white rounded-2xl space-y-10">
      <motion.h2
        className="text-3xl font-bold text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        ⚙ Settings
      </motion.h2>

      {/* Avatar Update */}
      <motion.form
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleAvatarUpload}
        className="space-y-4 bg-[#181818] p-5 rounded-xl shadow-lg"
        encType="multipart/form-data"
      >
        <h3 className="text-xl font-semibold">Update Avatar</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="w-full p-2 rounded-lg bg-[#121212] border border-gray-700"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-[#FF0000] hover:bg-red-700 p-3 rounded-lg font-semibold"
        >
          Upload Avatar
        </motion.button>
      </motion.form>

      {/* Cover Image Update */}
      <motion.form
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleCoverImageUpload}
        className="space-y-4 bg-[#181818] p-5 rounded-xl shadow-lg"
        encType="multipart/form-data"
      >
        <h3 className="text-xl font-semibold">Update Cover Image</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverImageChange}
          className="w-full p-2 rounded-lg bg-[#121212] border border-gray-700"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-[#FF0000] hover:bg-red-700 p-3 rounded-lg font-semibold"
        >
          Upload Cover Image
        </motion.button>
      </motion.form>

      {/* Existing forms below: Change Password, Update Account, Forgot Password, Set New Password, Logout */}
      {/* ... your existing JSX for those forms here ... */}

      {/* Change Password */}
      <motion.form
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleChangePassword}
        className="space-y-4 bg-[#181818] p-5 rounded-xl shadow-lg"
      >
        <h3 className="text-xl font-semibold">Change Password</h3>
        <input
          type="password"
          placeholder="Current Password"
          className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 focus:ring-2 focus:ring-[#FF0000]"
          value={passwordForm.currentPassword}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 focus:ring-2 focus:ring-[#FF0000]"
          value={passwordForm.newPassword}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 focus:ring-2 focus:ring-[#FF0000]"
          value={passwordForm.confirmPassword}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
          }
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-[#FF0000] hover:bg-red-700 p-3 rounded-lg font-semibold"
        >
          Change Password
        </motion.button>
      </motion.form>

      {/* Update Account */}
      <motion.form
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleUpdateAccountDetails}
        className="space-y-4 bg-[#181818] p-5 rounded-xl shadow-lg"
      >
        <h3 className="text-xl font-semibold">Update Account</h3>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 focus:ring-2 focus:ring-[#FF0000]"
          value={accountForm.fullName}
          onChange={(e) =>
            setAccountForm({ ...accountForm, fullName: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 focus:ring-2 focus:ring-[#FF0000]"
          value={accountForm.email}
          onChange={(e) =>
            setAccountForm({ ...accountForm, email: e.target.value })
          }
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-[#FF0000] hover:bg-red-700 p-3 rounded-lg font-semibold"
        >
          Update Account
        </motion.button>
      </motion.form>

      {/* Forgot Password */}
      <motion.form
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleForgotPassword}
        className="space-y-4 bg-[#181818] p-5 rounded-xl shadow-lg"
      >
        <h3 className="text-xl font-semibold">Forgot Password</h3>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 focus:ring-2 focus:ring-[#FF0000]"
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value)}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-[#FF0000] hover:bg-red-700 p-3 rounded-lg font-semibold"
        >
          Send Reset Email
        </motion.button>
      </motion.form>

      {/* Set New Password */}
      <motion.form
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleNewPassword}
        className="space-y-4 bg-[#181818] p-5 rounded-xl shadow-lg"
      >
        <h3 className="text-xl font-semibold">Set New Password</h3>
        <input
          type="text"
          placeholder="Reset Token"
          className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 focus:ring-2 focus:ring-[#FF0000]"
          value={resetForm.token}
          onChange={(e) =>
            setResetForm({ ...resetForm, token: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 focus:ring-2 focus:ring-[#FF0000]"
          value={resetForm.password}
          onChange={(e) =>
            setResetForm({ ...resetForm, password: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 rounded-lg bg-[#121212] border border-gray-700 focus:ring-2 focus:ring-[#FF0000]"
          value={resetForm.confirmPassword}
          onChange={(e) =>
            setResetForm({ ...resetForm, confirmPassword: e.target.value })
          }
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-[#FF0000] hover:bg-red-700 p-3 rounded-lg font-semibold"
        >
          Update Password
        </motion.button>
      </motion.form>

      {/* Logout */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="bg-[#FF0000] hover:bg-red-700 p-3 rounded-lg font-semibold w-full"
        >
          Logout
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Settings;
