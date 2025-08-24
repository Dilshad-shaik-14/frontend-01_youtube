import { useEffect, useState } from "react";
import { getSubscribedChannels, getChannelSubscribers } from "../Index/api";
import { useSelector } from "react-redux";
import UserCard from "../components/UserCard";

const Subscriptions = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedCard, setExpandedCard] = useState(null); // track expanded card

  const user = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        setError("");

        const userId = user._id;
        const channelId = user._id;

        const [subscribedChannelsRes, channelSubscribersRes] = await Promise.all([
          getSubscribedChannels(userId),
          getChannelSubscribers(channelId),
        ]);

        setSubscriptions(subscribedChannelsRes?.data || []);
        setSubscribers(channelSubscribersRes?.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load subscription data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?._id]);

  if (!user?._id) {
    return (
      <div className="p-6 text-lg text-base-content">
        Please log in to view subscriptions.
      </div>
    );
  }

  const handleToggleExpand = (id) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-1 min-h-screen bg-base-200 dark:bg-base-300 text-base-content">
      <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10 py-8 overflow-auto max-w-[1600px] w-full mx-auto space-y-12">
        
        {/* My Subscriptions */}
        <section>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 border-b-4 border-red-500 pb-2 w-fit text-base-content">
            My Subscriptions
          </h2>
          {loading ? (
            <p className="text-base-content/60">Loading subscriptions...</p>
          ) : error ? (
            <p className="text-error">{error}</p>
          ) : subscriptions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {subscriptions
                .filter((item) => item?.channel?._id)
                .map((item) => (
                  <UserCard
                    key={item.channel._id}
                    user={{
                      _id: item.channel._id,
                      userName: item.channel.userName,
                      fullName: item.channel.fullName,
                      avatar: item.channel.avatar,
                      coverImage: item.channel.coverImage,
                      email: item.channel.email,
                      createdAt: item.channel.createdAt,
                      isSubscribed: true,
                    }}
                    showSubscribe={true}
                    isExpanded={expandedCard === item.channel._id}
                    onToggleExpand={() => handleToggleExpand(item.channel._id)}
                  />
                ))}
            </div>
          ) : (
            <p className="text-base-content/60">
              You haven’t subscribed to any channels.
            </p>
          )}
        </section>

        {/* My Subscribers */}
        <section>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 border-b-4 border-red-500 pb-2 w-fit text-base-content">
            My Subscribers
          </h2>
          {loading ? (
            <p className="text-base-content/60">Loading subscribers...</p>
          ) : error ? (
            <p className="text-error">{error}</p>
          ) : subscribers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {subscribers
                .filter((item) => item?.subscriber?._id)
                .map((item) => (
                  <UserCard
                    key={item.subscriber._id}
                    user={{
                      _id: item.subscriber._id,
                      userName: item.subscriber.userName,
                      fullName: item.subscriber.fullName,
                      avatar: item.subscriber.avatar,
                      coverImage: item.subscriber.coverImage,
                      email: item.subscriber.email,
                      createdAt: item.subscriber.createdAt, 
                      isSubscribed: false,
                    }}
                    showSubscribe={false}
                    isExpanded={expandedCard === item.subscriber._id}
                    onToggleExpand={() => handleToggleExpand(item.subscriber._id)}
                  />
                ))}
            </div>
          ) : (
            <p className="text-base-content/60">
              No one has subscribed to your channel yet.
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Subscriptions;
