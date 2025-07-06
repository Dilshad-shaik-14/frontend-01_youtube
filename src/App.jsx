// App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { useDispatch, useSelector } from "react-redux";
import { currentUserSuccess } from "./utils/authSlice";
import { currentUser } from "./Index/api";

const App = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.auth);

    useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await currentUser();
        dispatch(currentUserSuccess(res));
      } catch (err) {
        console.error("Auth fetch failed:", err);
      }
    };

    fetchCurrentUser();
  }, [dispatch]);



  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
