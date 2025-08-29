import { NavLink } from "react-router-dom";
import {
  Home,
  ListVideo,
  Heart,
  Star,
  FileUp,
  UserCircle,
  Settings,
} from "lucide-react";

const navLinks = [
  { to: "/", label: "Home", icon: <Home size={20} /> },
  { to: "/playlists", label: "My Playlists", icon: <ListVideo size={20} /> },
  { to: "/likes", label: "Liked", icon: <Heart size={20} /> },
  { to: "/myuploads", label: "My Uploads", icon: <Star size={20} /> },
  { to: "/subscriptions", label: "Subscriptions", icon: <UserCircle size={20} /> },
  { to: "/uploads", label: "Upload", icon: <FileUp size={20} /> },
  { to: "/profile", label: "Profile", icon: <UserCircle size={20} /> },
  { to: "/settings", label: "Settings", icon: <Settings size={20} /> },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      {/* Backdrop (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-50
        w-48 sm:w-64
        flex flex-col
        bg-base-100/95 backdrop-blur-md
        shadow-lg border-r border-base-300
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
        aria-label="Sidebar Navigation"
      >
        <nav className="menu flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {navLinks.map(({ to, icon, label }) => (
            <SidebarLink key={to} to={to} icon={icon} label={label} />
          ))}
        </nav>
      </aside>
    </>
  );
}

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl
         text-sm sm:text-base md:text-lg transition-all duration-200
         ${
           isActive
             ? "bg-red-500/20 text-red-500 font-semibold"
             : "hover:bg-red-500/10 hover:text-red-500 text-base-content"
         }`
      }
    >
      <div className="w-5 h-5 sm:w-6 sm:h-6">{icon}</div>
      <span className="truncate">{label}</span>
    </NavLink>
  );
}
