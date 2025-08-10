import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  setResetPasswordLoading,
  setResetPasswordSuccess,
  setResetPasswordError,
} from "../utils/authSlice";
import { resetPassword } from "../Index/api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loadingResetPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    dispatch(setResetPasswordLoading(true));
    try {
      await resetPassword({ token, password, confirmPassword });
      dispatch(setResetPasswordSuccess("Password updated successfully!"));
      toast.success("Password updated successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      dispatch(setResetPasswordError(error?.message || "Password reset failed"));
      toast.error(error?.message || "Password reset failed");
    } finally {
      dispatch(setResetPasswordLoading(false));
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow mt-10">
      <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <button
          type="submit"
          className={`btn-primary w-full ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;
