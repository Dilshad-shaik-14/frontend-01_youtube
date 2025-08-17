import { createSlice } from "@reduxjs/toolkit";
import { applyTheme } from "./applyTheme";

const initialTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "black" : "light");

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: localStorage.getItem("token") || null,
  theme: initialTheme,
  loadingResetPassword: false,
  resetPasswordError: null,
  resetPasswordSuccess: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },

    loginSuccess: (state, action) => {
      const { data, token } = action.payload;
      state.currentUser = data;
      state.token = token || null;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      localStorage.setItem("user", JSON.stringify(data));
      if (token) localStorage.setItem("token", token);
      else localStorage.removeItem("token");
    },

    registerSuccess: (state, action) => {
      const { data, token } = action.payload;
      state.currentUser = data;
      state.token = token || null;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      localStorage.setItem("user", JSON.stringify(data));
      if (token) localStorage.setItem("token", token);
      else localStorage.removeItem("token");
    },

    logoutSuccess: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.token = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    currentUserSuccess: (state, action) => {
      const { data } = action.payload;
      state.currentUser = data;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    loadFromStorage: (state) => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      if (storedUser && token) {
        state.currentUser = JSON.parse(storedUser);
        state.token = token;
        state.isAuthenticated = true;
      }
    },

    toggleTheme: (state) => {
      const newTheme = state.theme === "black" ? "light" : "black";
      state.theme = newTheme;
      localStorage.setItem("theme", newTheme);

      // ✅ Use helper for DaisyUI
      applyTheme(newTheme);
    },

    // Reset password reducers
    setResetPasswordLoading: (state, action) => {
      state.loadingResetPassword = action.payload;
    },
    setResetPasswordSuccess: (state, action) => {
      state.resetPasswordSuccess = action.payload;
      state.resetPasswordError = null;
      state.loadingResetPassword = false;
    },
    setResetPasswordError: (state, action) => {
      state.resetPasswordError = action.payload;
      state.resetPasswordSuccess = null;
      state.loadingResetPassword = false;
    },
  },
});

export const {
  setLoading,
  setError,
  loginSuccess,
  logoutSuccess,
  registerSuccess,
  currentUserSuccess,
  loadFromStorage,
  toggleTheme,
  setResetPasswordLoading,
  setResetPasswordSuccess,
  setResetPasswordError,
} = authSlice.actions;

export default authSlice.reducer;
