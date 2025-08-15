import { Moon, Sun, Video } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../utils/authSlice";
import { useState } from "react";

export default function Navbar({ toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, theme } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/channel/${searchQuery.trim()}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-white/90 dark:bg-black backdrop-blur-xl shadow-md border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      
      {/* Left Section - Logo + Sidebar Toggle */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle Button for Mobile */}
        <button
          className="md:hidden text-zinc-800 dark:text-white text-2xl hover:scale-110 transition-transform duration-200 active:scale-95"
          onClick={toggleSidebar}
        >
          ☰
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg text-zinc-900 dark:text-white hover:opacity-90 transition-all"
        >
          <Video size={22} className="text-[#FF0000]" />
          MyTube
        </Link>
      </div>

      {/* Center Section - Search Input */}
      <form
        onSubmit={handleSearch}
        className="flex-grow max-w-md mx-4 hidden sm:flex"
      >
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-[#FF0000] text-sm text-zinc-800 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 shadow-inner transition-all"
        />
      </form>

      {/* Right Section - Theme Toggle + Avatar */}
      <div className="flex items-center gap-4">
        {/* Theme Switcher */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition duration-300 active:scale-95"
        >
          {theme === "dark" ? (
            <Sun size={18} className="text-yellow-400" />
          ) : (
            <Moon size={18} className="text-zinc-700" />
          )}
        </button>

        {/* Avatar */}
        {currentUser && (
          <Link
            to={`/profile/${currentUser._id}`}
            className="hover:scale-105 transition-transform duration-200"
          >
            <img
              src={currentUser.avatar || "/default-avatar.png"}
              alt={currentUser.userName || "User"}
              className="w-9 h-9 rounded-full object-cover border-2 border-[#FF0000] shadow-sm"
            />
          </Link>
        )}
      </div>
    </header>
  );
}
