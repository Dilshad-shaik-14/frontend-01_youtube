import React, { useState } from "react";
import { toggleSubscription } from "../Index/api";
import { toast } from "react-hot-toast";

const UserModal = ({ user, onClose }) => {
  const [isSubscribed, setIsSubscribed] = useState(user?.isSubscribed);

  const handleSubscribe = async () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/10 dark:bg-black/30 backdrop-blur-md">
      <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 sm:p-8 shadow-lg w-full max-w-xl">
        {/* Cover Image */}
        {user.coverImage && (
          <img
            src={user.coverImage}
            alt="cover"
            className="w-full h-40 sm:h-56 object-cover rounded-xl mb-4"
          />
        )}

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <img
            src={user.avatar}
            alt={user.userName}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#FF0000] shadow-lg"
          />

          {/* User Info */}
          <div className="text-gray-900 dark:text-white w-full">
            <h2 className="text-2xl font-bold">{user.fullName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              @{user.userName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Email: {user.email}
            </p>

            <button
              onClick={handleSubscribe}
              className={`mt-4 py-2 px-6 rounded-lg font-semibold text-sm transition duration-300 tracking-wide ${
                isSubscribed
                  ? "bg-[#FF0000] text-white hover:bg-[#e60000]"
                  : "bg-white text-[#0f0f0f] hover:bg-gray-200"
              }`}
            >
              {isSubscribed ? "Unsubscribe" : "Subscribe"}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full text-sm text-gray-400 hover:text-white text-center underline"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserModal;
