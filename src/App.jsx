// App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { useDispatch } from "react-redux";
import { currentUserSuccess } from "./utils/authSlice";
import { currentUser } from "./api";

const App = () => {
  const dispatch = useDispatch();

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