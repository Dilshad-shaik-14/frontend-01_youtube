// Layout.jsx (main refactor to match image layout)
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../utils/authSlice";
import { applyTheme } from "../utils/applyTheme";

export default function Layout() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.auth.theme);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div
      className={`flex flex-col h-screen transition-colors duration-300 ${
        theme === "black"
          ? "bg-[#000000] text-[#ffffff]"
          : "bg-[#ffffff] text-[#000000]"
      }`}
    >
      {/* Navbar fixed at top */}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Content below navbar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main
          className={`flex-1 overflow-y-auto p-4 transition-colors duration-300 ${
            theme === "black" ? "bg-[#000000]" : "bg-[#ffffff]"
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
