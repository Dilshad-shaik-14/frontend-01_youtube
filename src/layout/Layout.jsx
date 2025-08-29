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
    <div
      className={`flex flex-col h-screen transition-colors duration-300 ${
        theme === "black"
          ? "bg-[#000000] text-[#ffffff]"
          : "bg-[#ffffff] text-[#000000]"
      }`}
    >
      {/* Navbar fixed at top */}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* Sidebar (mobile + desktop) */}
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
