import { useEffect, useState } from "react";
import { getSubscribedChannels, getChannelSubscribers } from "../Index/api";
import { useSelector } from "react-redux";
import UserCard from "../components/UserCard";

const Subscriptions = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        setError("");

        const [subResult, subsResult] = await Promise.all([
          getSubscribedChannels(user._id),
          getChannelSubscribers(user._id),
        ]);

        const subsData = subResult?.data?.subscriptions || [];
        const subbersData = subsResult?.data?.subscribers || [];

        // Mark subscriptions with isSubscribed = true for toggle button
        const subscriptionsWithFlag = subsData.map((u) => ({
          ...u,
          isSubscribed: true,
        }));

        setSubscriptions(subscriptionsWithFlag);
        setSubscribers(subbersData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load subscriptions or subscribers.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id]);

  if (!user?._id) {
    return (
      <div className="text-white p-6">
        Please log in to view subscriptions.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-10 space-y-14">
      <section>
        <h1 className="text-3xl font-bold text-[#FF0000] mb-6">
          My Subscriptions
        </h1>

        {loading ? (
          <p className="text-gray-400">Loading subscriptions...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : subscriptions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {subscriptions.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You haven't subscribed to any channels.</p>
        )}
      </section>

      <section>
        <h1 className="text-3xl font-bold text-[#00E676] mb-6">
          My Subscribers
        </h1>

        {loading ? (
          <p className="text-gray-400">Loading subscribers...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : subscribers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {subscribers.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No one has subscribed to your channel yet.
          </p>
        )}
      </section>
    </div>
  );
};

export default Subscriptions;
