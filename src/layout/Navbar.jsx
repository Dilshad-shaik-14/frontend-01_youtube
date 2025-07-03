// src/components/Navbar.jsx
import { Moon, Sun, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function Navbar({ toggleSidebar }) {
  const { user } = useSelector((state) => state.auth);
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white/70 dark:bg-black/30 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-700 shadow-md">
      <div className="flex items-center gap-4">
        {/* Mobile toggle button */}
        <button className="md:hidden text-red-500 text-xl" onClick={toggleSidebar}>
          ☰
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-red-500">
          <Video size={22} /> MyTube
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search..."
          className="px-3 py-1 rounded-md text-sm bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 w-48 md:w-64 transition-all duration-300 focus:ring-2 focus:ring-red-400"
        />

        {/* Theme toggle */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User profile */}
        {user && (
          <Link to={`/profile/${user._id}`}>
            <img
              src={user.avatar}
              alt={user.userName}
              className="w-8 h-8 rounded-full object-cover border-2 border-red-500 shadow-md"
            />
          </Link>
        )}
      </div>
    </header>
  );
}
