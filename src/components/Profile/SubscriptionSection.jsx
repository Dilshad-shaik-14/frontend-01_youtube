import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SubscriptionSection({ userId }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axios.get(`/subscriptions?subscriber=${userId}`);
        console.log("Subscriptions API response:", res.data);

        setSubscriptions(Array.isArray(res.data) ? res.data : res.data.subscriptions || []);
      } catch (err) {
        console.error("Failed to fetch subscriptions:", err);
        setSubscriptions([]); // fallback to avoid crash
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [userId]);

  if (loading) return <p className="text-zinc-500">Loading subscriptions...</p>;
  if (subscriptions.length === 0) return <p className="text-zinc-500">Not subscribed to anyone yet.</p>;

  return (
    <div className="space-y-4">
      {subscriptions.map((user) => (
        <div
          key={user._id}
          className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow"
        >
          <img
            src={user.avatar}
            alt={user.username}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{user.fullName}</h3>
            <p className="text-sm text-zinc-500">@{user.username}</p>
            <p className="text-xs text-zinc-400">
              Joined{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
