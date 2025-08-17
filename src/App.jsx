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

const App = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      dispatch(loadFromStorage());

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
  }, [dispatch, token]);

  if (!appReady) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
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
