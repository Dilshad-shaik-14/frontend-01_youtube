// src/layout/Layout.jsx
import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../utils/authSlice";
import { applyTheme } from "../utils/applyTheme";

export default function Layout() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.auth.theme);


  useEffect(() => {
    applyTheme(theme); 
  }, [theme]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="flex h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar isOpen={false} toggle={() => {}} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          toggleSidebar={() => {}}
          darkMode={theme === "dark"}
          toggleTheme={handleToggleTheme}
        />

        <main className="flex-1 overflow-y-auto p-4 bg-white dark:bg-black transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
