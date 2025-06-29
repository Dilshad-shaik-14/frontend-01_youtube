import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutSuccess } from "../utils/authSlice";

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 🌙 Dark mode toggle logic
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setTheme(storedTheme);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-zinc-900 shadow px-4 py-3 flex items-center justify-between">
      {/* Left: Logo + Links */}
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          🌟 MyApp
        </Link>
        {isAuthenticated && (
          <Link to="/" className="text-sm text-zinc-700 dark:text-zinc-300 hover:underline">
            Home
          </Link>
        )}
      </div>

      {/* Right: Theme Toggle + Avatar Dropdown */}
      {isAuthenticated && (
        <div className="flex items-center gap-4 relative">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-sm px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded hover:ring-1"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* Avatar */}
          <img
            src={user.avatar}
            alt="avatar"
            className="w-9 h-9 rounded-full cursor-pointer border-2 border-blue-500"
            onClick={() => setDropdownOpen((prev) => !prev)}
          />

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute top-12 right-0 bg-white dark:bg-zinc-800 shadow rounded p-2 w-40 z-50">
              <Link
                to={`/profile/${user._id}`}
                className="block px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setDropdownOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-red-100 dark:hover:bg-zinc-700 rounded text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
