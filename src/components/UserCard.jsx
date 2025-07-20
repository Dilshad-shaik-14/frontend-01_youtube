// components/UserCard.jsx
import { useState } from "react";
import { toggleSubscription } from "../Index/api";
import { toast } from "react-hot-toast";

const UserCard = ({ user }) => {
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
    <div className="w-full sm:w-[300px] md:w-[360px] bg-gradient-to-br from-[#0f0f0f] to-[#1c1c1c] text-white rounded-2xl shadow-xl border border-[#272727] p-5 backdrop-blur-sm transition hover:scale-[1.02] duration-300 hover:shadow-2xl group">
      <div className="flex items-center gap-4">
        <img
          src={user.avatar}
          alt={user.userName}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#FF0000] shadow-md group-hover:scale-105 transition"
        />
        <div className="flex flex-col">
          <h2 className="text-lg sm:text-xl font-semibold">{user.fullName}</h2>
          <p className="text-sm text-gray-400">@{user.userName}</p>
          <p className="text-xs text-gray-500 truncate max-w-[200px]">
            {user.email}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <button
          onClick={handleSubscribe}
          className={`w-full py-2 px-4 rounded-xl font-semibold text-sm transition duration-300 tracking-wide
            ${
              isSubscribed
                ? "bg-[#FF0000] text-white hover:bg-[#e60000]"
                : "bg-white text-[#0f0f0f] hover:bg-gray-100"
            }
          `}
        >
          {isSubscribed ? "Unsubscribe" : "Subscribe"}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
