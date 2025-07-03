// src/layout/Layout.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Handle theme toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900 text-black dark:text-white">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          toggleSidebar={toggleSidebar}
          darkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />

        <main className="flex-1 overflow-y-auto p-4 bg-white dark:bg-zinc-900 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
