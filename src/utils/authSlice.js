import { createSlice } from "@reduxjs/toolkit";

const initialTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: localStorage.getItem("token") || null,
  theme: initialTheme,
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
      localStorage.setItem("token", token || "");
    },

    registerSuccess: (state, action) => {
      const { data, token } = action.payload;
      state.currentUser = data;
      state.token = token || null;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", token || "");
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
      const newTheme = state.theme === "dark" ? "light" : "dark";
      state.theme = newTheme;
      localStorage.setItem("theme", newTheme);

      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
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
} = authSlice.actions;

export default authSlice.reducer;
