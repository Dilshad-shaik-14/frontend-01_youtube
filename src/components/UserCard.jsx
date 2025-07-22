import React, { useState } from "react";
import { toggleSubscription } from "../Index/api";
import { toast } from "react-hot-toast";

const UserCard = ({ user, isExpanded = false, onToggleExpand }) => {
  const [isSubscribed, setIsSubscribed] = useState(user?.isSubscribed || false);

  const handleSubscribe = async (e) => {
    e.stopPropagation();
    try {
      await toggleSubscription(user._id);
      setIsSubscribed(!isSubscribed);
      toast.success(
        isSubscribed ? "Unsubscribed from channel" : "Subscribed to channel"
      );
    } catch (error) {
      toast.error("Subscription failed");
    }
  };

  return (
    <div
      onClick={() => !isExpanded && onToggleExpand?.()}
      className={`relative transition-all duration-300 ease-in-out overflow-hidden
        rounded-xl border border-gray-200 dark:border-zinc-700 shadow-md w-full max-w-md mx-auto
        ${isExpanded ? "bg-white dark:bg-zinc-900 cursor-default" : "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md hover:scale-[1.01] cursor-pointer"}
      `}
    >
      {/* Cover Image */}
      <div className="relative h-32 sm:h-40 w-full">
        <img
          src={user.coverImage || "/default-cover.jpg"}
          alt="Cover"
          className="object-cover w-full h-full"
        />

        {/* Avatar overlapping bottom-left */}
        <div className="absolute -bottom-8 left-4">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt={user.userName}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-4 border-white dark:border-zinc-900 shadow-md"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="pt-12 pb-4 px-4 sm:px-6">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
          {user.fullName || "Unnamed User"}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">@{user.userName}</p>

        {/* Expanded Info */}
        {isExpanded && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            <p>📧 {user.email || "No email available"}</p>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Joined on: {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleSubscribe}
            className={`py-2 px-5 text-sm font-semibold rounded-lg transition duration-300
              ${isSubscribed
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-white text-black hover:bg-gray-100 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
              }`}
          >
            {isSubscribed ? "Unsubscribe" : "Subscribe"}
          </button>

          {isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand?.();
              }}
              className="text-sm text-gray-400 hover:text-red-500 underline"
            >
              Collapse
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
