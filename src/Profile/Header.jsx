import React from "react";

export default function Header({ user }) {
  return (
    <div className="flex items-center gap-4 mb-6">
     
      <img
        src={user.avatar}
        alt={user.username}
        className="w-20 h-20 rounded-full object-cover border border-zinc-300 dark:border-zinc-700"
      />

    
      <div>
        <h2 className="text-xl font-semibold">{user.fullName}</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">@{user.username}</p>

      
        {user.bio && (
          <p className="text-sm mt-2 text-zinc-600 dark:text-zinc-300">{user.bio}</p>
        )}

        <p className="text-xs text-zinc-400 mt-1">
          Joined {new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
