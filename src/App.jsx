import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { useDispatch, useSelector } from "react-redux";
import {
  currentUserSuccess,
  loadFromStorage,
  logoutSuccess,
} from "./utils/authSlice";
import { currentUser as fetchCurrentUser } from "./Index/api";
import { applyTheme } from "./utils/applyTheme";

const App = () => {
  const dispatch = useDispatch();
  const [appReady, setAppReady] = useState(false);
  const theme = useSelector((state) => state.auth.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const initAuth = async () => {
      dispatch(loadFromStorage());
      // use the same key as the axios interceptor and authSlice
      const token = localStorage.getItem("token");
      if (!token) {
        setAppReady(true);
        return;
      }

      try {
        const res = await fetchCurrentUser();
        dispatch(currentUserSuccess(res));
      } catch (err) {
        console.error("Auth check failed:", err);
        dispatch(logoutSuccess());
      } finally {
        setAppReady(true);
      }
    };

    initAuth();
  }, [dispatch]);

  if (!appReady) {
    return (
      <div className="h-screen flex items-center justify-center text-zinc-500 dark:text-zinc-400">
        Checking authentication...
      </div>
    );
  }

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
