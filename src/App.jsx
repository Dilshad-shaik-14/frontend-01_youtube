// App.jsx
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
  const { theme, currentUser } = useSelector((state) => state.auth);
  const [appReady, setAppReady] = useState(false); 

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const initAuth = async () => {
      dispatch(loadFromStorage());

      try {
        const res = await fetchCurrentUser();
        dispatch(currentUserSuccess(res));
      } catch (err) {
        dispatch(logoutSuccess()); 
        console.error("Auth check failed:", err);
      } finally {
        setAppReady(true);
      }
    };

    initAuth();
  }, [dispatch]);

  if (!appReady) {
    return <div className="text-center mt-10 text-zinc-500">Checking authentication...</div>;
  }

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
