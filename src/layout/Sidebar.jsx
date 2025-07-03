// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import {
  Home, ListVideo, Heart, Star, Upload, Compass, UserCircle, Settings
} from "lucide-react";

export default function Sidebar({ isOpen, toggle }) {
  return (
    <aside
      className={`fixed md:static top-0 left-0 z-50 h-full w-64 bg-white/80 dark:bg-black/30 backdrop-blur-lg p-5 shadow-lg border-r border-zinc-200 dark:border-zinc-700 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-red-500 tracking-tight">MyTube</h1>
        <button onClick={toggle} className="md:hidden text-red-500 text-lg">
          ✕
        </button>
      </div>

      <nav className="space-y-3">
        <SidebarLink to="/" icon={<Home size={18} />} label="Home" />
        <SidebarLink to="/playlists" icon={<ListVideo size={18} />} label="My Playlists" />
        <SidebarLink to="/liked" icon={<Heart size={18} />} label="Liked" />
        <SidebarLink to="/my-uploads" icon={<Star size={18} />} label="My Uploads" />
        <SidebarLink to="/subscriptions" icon={<UserCircle size={18} />} label="Subscriptions" />
        <SidebarLink to="/upload" icon={<Upload size={18} />} label="Upload" />
        <SidebarLink to="/explore" icon={<Compass size={18} />} label="Explore" />
        <SidebarLink to="/settings" icon={<Settings size={18} />} label="Settings" />
      </nav>
    </aside>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
            : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
