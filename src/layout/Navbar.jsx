import { Moon, Sun, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../utils/authSlice";

export default function Navbar({ toggleSidebar }) {
  const dispatch = useDispatch();
  const { currentUser, theme } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-md shadow-sm border-b border-zinc-200 dark:border-zinc-700">
      {/* Left Section - Logo + Sidebar Toggle */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-zinc-800 dark:text-white text-2xl"
          onClick={toggleSidebar}
        >
          ☰
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-lg text-zinc-800 dark:text-white"
        >
          <Video size={22} className="text-red-500" />
          MyTube
        </Link>
      </div>

      {/* Center Section - Search */}
      <div className="flex-grow max-w-md mx-4 hidden sm:flex">
        <input
          type="text"
          placeholder="Search"
          className="w-full px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 focus:ring-2 focus:ring-red-400 text-sm"
        />
      </div>

      {/* Right Section - Theme Toggle + Avatar */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Current User Avatar */}
        {currentUser && (
          <Link to={`/profile/${currentUser._id}`}>
            <img
              src={currentUser.avatar || "/default-avatar.png"}
              alt={currentUser.userName || "User"}
              className="w-8 h-8 rounded-full object-cover"
            />
          </Link>
        )}
      </div>
    </header>
  );
}
