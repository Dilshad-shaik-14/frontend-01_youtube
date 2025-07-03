import React, { useEffect, useState } from "react";
import axios from "axios";

const SubscriptionCard = ({ user }) => (
  <div className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow">
    <img
      src={user.avatar || "/default-avatar.png"}
      alt={user.fullName}
      className="w-12 h-12 rounded-full object-cover"
    />
    <div>
      <h3 className="font-semibold">{user.fullName}</h3>
      <p className="text-sm text-zinc-500">@{user.userName}</p>
      <p className="text-xs text-zinc-400">
        Joined{" "}
        {new Date(user.createdAt).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </p>
    </div>
  </div>
);

export default function SubscriptionPage({ userId }) {
  const [subscribedTo, setSubscribedTo] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const [res1, res2] = await Promise.all([
          axios.get(`/api/v1/subscriptions?subscriber=${userId}`),
          axios.get(`/api/v1/subscribers?channel=${userId}`),
        ]);

        setSubscribedTo(Array.isArray(res1.data) ? res1.data : res1.data.users || []);
        setSubscribers(Array.isArray(res2.data) ? res2.data : res2.data.users || []);
      } catch (err) {
        console.error("Error fetching subscriptions/subscribers", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchSubs();
  }, [userId]);

  if (loading) return <p className="text-zinc-500">Loading subscriptions...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4 text-red-500">Subscribed To</h2>
        {subscribedTo.length === 0 ? (
          <p className="text-zinc-500">You haven't subscribed to anyone yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {subscribedTo.map((user) => (
              <SubscriptionCard key={user._id} user={user} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-red-500">Subscribers</h2>
        {subscribers.length === 0 ? (
          <p className="text-zinc-500">You have no subscribers yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {subscribers.map((user) => (
              <SubscriptionCard key={user._id} user={user} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

