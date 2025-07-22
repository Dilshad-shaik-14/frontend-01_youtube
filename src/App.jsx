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
import { applyTheme } from "./utils/applyTheme"; // ✅ Import this

const App = () => {
  const dispatch = useDispatch();
  const [appReady, setAppReady] = useState(false);
  const theme = useSelector((state) => state.auth.theme); // ✅ Grab theme from redux

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const initAuth = async () => {
      dispatch(loadFromStorage());

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
