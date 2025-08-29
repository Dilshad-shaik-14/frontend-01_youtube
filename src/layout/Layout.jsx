import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { applyTheme } from "../utils/applyTheme";

export default function Layout() {
  const theme = useSelector((state) => state.auth.theme);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
// Layout.jsx
<div
  className={`min-h-screen transition-colors duration-300 ${
    theme === "black"
      ? "bg-[#000000] text-[#ffffff]"
      : "bg-[#ffffff] text-[#000000]"
  }`}
>
  {/* Navbar - fixed at top */}
  <div className="fixed top-0 left-0 right-0 z-50">
    <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
  </div>

  {/* Page layout below navbar */}
  <div className="flex pt-[5rem]"> 
    {/* Sidebar */}
    <Sidebar
      isOpen={sidebarOpen}
      toggleSidebar={() => setSidebarOpen(false)}
    />

    {/* Main Content */}
    <main
      className={`flex-1 overflow-y-auto transition-colors duration-300 ${
        theme === "black" ? "bg-[#000000]" : "bg-[#ffffff]"}
        md:ml-64
      `}
    >
      <div className="w-full max-w-[1200px] mx-auto px-4 py-6">
        <Outlet />
      </div>
    </main>
  </div>
</div>

  );
}
