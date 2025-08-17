// Navbar.jsx
import { Moon, Sun, Video, Search } from "lucide-react";
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
<header className="sticky top-0 z-50 bg-base-100/95 backdrop-blur-lg shadow-md border-b border-base-300 transition-colors duration-300">
  <div className="flex items-center justify-between px-8 lg:px-14 h-20">
    
    {/* Left Section */}
    <div className="flex items-center gap-5">
      <button
        className="btn btn-ghost md:hidden text-2xl p-2 rounded-xl hover:bg-red-600/20 transition"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>
      <Link
        to="/"
        className="flex items-center gap-3 font-extrabold text-2xl hover:text-red-600 transition"
      >
        <Video size={28} className="text-red-500 drop-shadow-sm" />
        <span className="hidden sm:inline tracking-wide">MyTube</span>
      </Link>
    </div>

    {/* Center - Search */}
    <form
      onSubmit={handleSearch}
      className="hidden sm:flex flex-1 max-w-3xl mx-10"
    >
      <input
        type="text"
        placeholder="Search for videos, channels..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="input input-bordered w-full h-12 rounded-full px-5 text-base shadow-md focus:ring-2 focus:ring-red-500 transition"
      />
    </form>

    {/* Right Section */}
    <div className="flex items-center gap-4 sm:gap-7">
      <button
        onClick={() => {
          const el = document.getElementById("mobile-search");
          if (el) el.classList.toggle("hidden");
        }}
        className="btn btn-ghost sm:hidden p-2 rounded-full hover:bg-red-600/20"
        aria-label="Search"
      >
        <Search className="w-6 h-6 text-red-500" />
      </button>

      <button
        onClick={() => dispatch(toggleTheme())}
        className="btn btn-ghost btn-circle hover:bg-red-600/20 transition"
      >
        {theme === "black" ? (
          <Sun size={22} className="text-yellow-400" />
        ) : (
          <Moon size={22} className="text-red-500" />
        )}
      </button>

      {currentUser && (
        <Link
          to={`/profile/${currentUser._id}`}
          className="avatar hover:scale-110 hover:ring-2 hover:ring-red-500 transition duration-200"
        >
          <div className="w-11 h-11 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-2">
            <img
              src={currentUser.avatar || "/default-avatar.png"}
              alt={currentUser.userName || "User"}
              className="rounded-full"
            />
          </div>
        </Link>
      )}
    </div>
  </div>
</header>

  );
}
