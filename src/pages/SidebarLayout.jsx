
import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Home,
  Star,
  Heart,
  Upload,
  Compass,
  UserCircle,
  Video,
  Settings,
  ListVideo,
} from "lucide-react";

export default function SidebarLayout() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-zinc-900 text-black dark:text-white">
      {/* Sidebar */}
      <aside className="w-60 p-4 border-r border-zinc-200 dark:border-zinc-700 hidden md:block">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <Video className="text-red-500" />
          <span className="text-lg font-bold">MyTube</span>
        </Link>

        <nav className="space-y-4 text-sm">
          <NavLink to="/" className="block hover:text-red-500">
            <Home size={16} className="inline mr-2" /> Home
          </NavLink>
          <NavLink to="/playlists" className="block hover:text-red-500">
            <ListVideo size={16} className="inline mr-2" /> My Playlists
          </NavLink>
          <NavLink to="/liked" className="block hover:text-red-500">
            <Heart size={16} className="inline mr-2" /> Liked
          </NavLink>
          <NavLink to="/my-uploads" className="block hover:text-red-500">
            <Star size={16} className="inline mr-2" /> My Uploads
          </NavLink>
          <NavLink to="/subscriptions" className="block hover:text-red-500">
            <UserCircle size={16} className="inline mr-2" /> Subscriptions
          </NavLink>
          <NavLink to="/upload" className="block hover:text-red-500">
            <Upload size={16} className="inline mr-2" /> Upload
          </NavLink>
          <NavLink to="/explore" className="block hover:text-red-500">
            <Compass size={16} className="inline mr-2" /> Explore
          </NavLink>
          <NavLink to="/settings" className="block hover:text-red-500">
            <Settings size={16} className="inline mr-2" /> Settings
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Navbar */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <Link to="/" className="md:hidden flex items-center gap-2">
              <Video className="text-red-500" />
              <span className="text-lg font-bold">MyTube</span>
            </Link>
            <input
              type="text"
              placeholder="Search"
              className="bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded px-3 py-1 text-sm w-64"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative hover:text-red-500">
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            <Link to="/upload">
              <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm">
                Upload
              </button>
            </Link>

            {user && (
              <Link to={`/profile/${user._id}`}>
                <img
                  src={user.avatar}
                  alt={user.userName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              </Link>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
