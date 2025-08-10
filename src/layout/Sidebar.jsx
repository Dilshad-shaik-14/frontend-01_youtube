import { NavLink } from "react-router-dom";
import {
  Home,
  ListVideo,
  Heart,
  Star,
  FileUp,
  FolderDown,
  Compass,
  UserCircle,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../utils/authSlice";

const navLinks = [
  { to: "/", label: "Home", icon: <Home size={18} /> },
  { to: "/playlists", label: "My Playlists", icon: <ListVideo size={18} /> },
  { to: "/likes", label: "Liked", icon: <Heart size={18} /> },
  { to: "/myuploads", label: "My Uploads", icon: <Star size={18} /> },
  { to: "/subscriptions", label: "Subscriptions", icon: <UserCircle size={18} /> },
  { to: "/uploads", label: "Upload", icon: <FileUp size={18} /> },
  { to: "/profile", label: "Profile", icon: <UserCircle size={18} /> },
  { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function Sidebar({ isOpen }) {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.auth.theme);

  return (
    <aside
      className={`fixed md:static top-0 left-0 z-50 h-full w-64 
        bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md 
        p-5 shadow-lg border-r border-zinc-200 dark:border-zinc-700 
        transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      aria-label="Sidebar Navigation"
    >
      {/* Header with Theme Toggle */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
          MyTube
        </h1>
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-full border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-400 transition" />
          ) : (
            <Moon className="w-5 h-5 text-blue-600 transition" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navLinks.map(({ to, icon, label }) => (
          <SidebarLink key={to} to={to} icon={icon} label={label} />
        ))}
      </nav>
    </aside>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
         ${
           isActive
             ? "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-300"
             : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
         }`
      }
    >
      <div className="group-hover:scale-110 transition-transform">{icon}</div>
      <span className="truncate">{label}</span>
    </NavLink>
  );
}
