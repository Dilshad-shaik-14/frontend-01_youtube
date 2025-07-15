import React from "react";

export default function UserCard({ user }) {
  if (!user) return null;

  const { avatar, fullName, username } = user;

  return (
    <div className="p-3 rounded-lg shadow bg-white dark:bg-zinc-800 flex items-center gap-3 border border-zinc-200 dark:border-zinc-700">
      <img
        src={avatar || "/default-avatar.png"}
        alt={username || "user"}
        className="w-10 h-10 rounded-full object-cover border border-red-500"
      />
      <div>
        <div className="font-semibold text-zinc-800 dark:text-zinc-100">
          {fullName || "Unknown User"}
        </div>
        <div className="text-xs text-zinc-500">@{username || "anonymous"}</div>
      </div>
    </div>
  );
}
