import React, { useState } from "react";
import { toggleSubscription } from "../Index/api";
import { toast } from "react-hot-toast";

const UserCard = ({
  user,
  isExpanded = false,
  onToggleExpand,
  showSubscribe = true,
}) => {
  if (!user) return null;

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
        rounded-2xl border border-base-200 shadow-lg w-full max-w-md mx-auto
        ${
          isExpanded
            ? "bg-base-100"
            : "bg-base-100/80 backdrop-blur-md hover:scale-[1.01] cursor-pointer"
        }
      `}
      data-theme="inherit"
    >
      {/* Cover Image */}
      <div className="relative h-32 sm:h-40 w-full">
        <img
          src={user?.coverImage?.trim() ? user.coverImage : "/default-cover.jpg"}
          alt="Cover"
          className="w-full h-full object-cover rounded-t-2xl"
        />

        {/* Avatar */}
        <div className="absolute -bottom-8 left-4">
          <img
            src={user?.avatar?.trim() ? user.avatar : "/default-avatar.png"}
            alt={user?.userName ?? "User"}
            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-4 border-base-100 shadow-md"
          />
        </div>
      </div>

      {/* Content */}
      <div className="pt-12 pb-4 px-4 sm:px-6">
        <h3 className="font-semibold text-lg text-base-content">
          {user?.fullName ?? "Unnamed User"}
        </h3>
        <p className="text-sm text-base-content/70">@{user?.userName}</p>

        {isExpanded && (
          <div className="mt-2 text-sm text-base-content/80">
            <p>📧 {user?.email ?? "No email available"}</p>
            <p className="mt-1 text-xs text-base-content/60">
              Joined on:{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          {showSubscribe && (
            <button
              onClick={handleSubscribe}
              className={`btn btn-sm font-semibold rounded-full transition duration-300 ${
                isSubscribed
                  ? "bg-red-600 text-white hover:bg-red-700 border-none"
                  : "bg-base-100 text-base-content hover:bg-base-200 border border-base-200"
              }`}
            >
              {isSubscribed ? "Unsubscribe" : "Subscribe"}
            </button>
          )}

          {isExpanded ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand?.();
              }}
              className="btn btn-sm btn-outline rounded-full text-base-content/80 hover:text-red-500 border-base-200"
            >
              Collapse
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand?.();
              }}
              className="btn btn-sm btn-outline rounded-full text-base-content/80 hover:text-red-500 border-base-200"
            >
              Expand
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
