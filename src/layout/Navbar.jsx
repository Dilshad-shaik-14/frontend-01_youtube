import { Moon, Sun, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../utils/authSlice";
import { useState } from "react";
import { getVideoByTitle } from "../Index/api";

export default function Navbar({ toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, theme } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    try {
      // always search videos while typing
      const res = await getVideoByTitle(value.trim());
      setResults(Array.isArray(res.data) ? res.data : [res.data]);
    } catch {
      setResults([]);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      // 1️⃣ Try channel first
      const channelRes = await getUserChannelProfile(searchQuery.trim());
      if (channelRes?.data) {
        navigate(`/channel/${channelRes.data.userName}`);
        setSearchQuery("");
        setResults([]);
        return;
      }
    } catch {
      // ignore 404 from channel
    }

    // 2️⃣ If not channel → fallback to videos
    navigate(`/search?title=${encodeURIComponent(searchQuery.trim())}`);

    setSearchQuery("");
    setResults([]);
  };

  const renderDropdown = (extraClass = "") => {
    if (!results.length) return null;

    return (
      <ul
        className={`absolute z-50 w-full bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-auto top-full mt-1 ${extraClass}`}
      >
        {results.map((v) => (
          <li
            key={v._id}
            className="px-4 py-2 hover:bg-red-100 cursor-pointer truncate transition-colors"
            onClick={() => {
              setSearchQuery(v.title);
              setResults([]);
              navigate(`/search?title=${encodeURIComponent(v.title)}`);
            }}
          >
            {v.title}
          </li>
        ))}
      </ul>
    );
  };

  return (
<header className="fixed top-0 left-0 right-0 z-50 bg-base-100/95 backdrop-blur-lg shadow-md border-b border-base-300 transition-colors duration-300">      <div className="flex items-center justify-between px-6 lg:px-10 h-16">
        {/* Left Section - Logo with subscript */}
        <div className="flex items-center gap-4 relative">
          <button
            className="btn btn-ghost md:hidden text-2xl p-2 rounded-xl hover:bg-red-600/20 transition-colors"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            ☰
          </button>

          <Link
            to="/"
            className="flex items-center font-extrabold text-xl hover:text-red-600 transition-colors relative"
          >
            {/* Main Logo */}
            <span className="text-red-500 text-5xl font-bold leading-none relative">
              D&amp;S
              {/* Subscript */}
              <span
                className="absolute text-sm text-red-500 pb-2"
                style={{
                  bottom: -10,
                  left: "110%",
                  transform: "translateX(-10%)",
                  fontSize: "0.875rem",
                }}
              >
                Clipit.Saveit
              </span>
            </span>
          </Link>
        </div>

        {/* Center Section - Search (desktop) */}
        <form
          onSubmit={handleSearch}
          className="hidden sm:flex flex-1 max-w-2xl mx-8 relative"
        >
          <input
            type="text"
            placeholder="Search for videos, channels..."
            value={searchQuery}
            onChange={handleInputChange}
            className="input input-bordered w-full h-11 rounded-full px-5 text-base shadow-sm focus:ring-2 focus:ring-red-500 transition-all"
          />

          <button
            type="submit"
            className="btn btn-ghost absolute right-1 top-1 px-3 py-2"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-red-500" />
          </button>

          {renderDropdown()}
        </form>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Mobile Search Icon */}
          <button
            onClick={() => {
              const el = document.getElementById("mobile-search");
              if (el) el.classList.toggle("hidden");
            }}
            className="btn btn-ghost sm:hidden p-2 rounded-full hover:bg-red-600/20"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-red-500" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="btn btn-ghost btn-circle hover:bg-red-600/20 transition-colors"
          >
            {theme === "black" ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} className="text-red-500" />
            )}
          </button>

          {/* Avatar */}
          {currentUser && (
            <Link
              to={`/profile/${currentUser._id}`}
              className="avatar hover:scale-110 hover:ring-2 hover:ring-red-500 transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-2">
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

      {/* Mobile Search Input */}
      <div
        id="mobile-search"
        className="absolute top-full left-0 w-full p-3 bg-base-100 border-b border-base-300 hidden sm:hidden"
      >
        <form onSubmit={handleSearch} className="flex gap-2 relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleInputChange}
            className="input input-bordered w-full h-11 rounded-full focus:ring-2 focus:ring-red-500 transition-all"
          />
          {renderDropdown()}
        </form>
      </div>
    </header>
  );
}
