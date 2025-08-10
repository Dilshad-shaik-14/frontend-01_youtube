import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserChannelProfile } from "../Index/api"
import { Loader } from "../layout/SkeletonCard";

export default function ChannelPage() {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChannel() {
      try {
        const data = await getUserChannelProfile(username);
        setChannel(data);
      } catch (err) {
        console.error("Error fetching channel:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchChannel();
  }, [username]);

  if (loading) return <Loader />;
  if (!channel) return <p className="text-center mt-10">Channel not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cover Image */}
      <div className="w-full h-60 bg-gray-300 relative">
        {channel.coverImage && (
          <img
            src={channel.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Channel Info */}
      <div className="max-w-5xl mx-auto px-4 mt-[-50px] flex items-center gap-6">
        <img
          src={channel.avatar}
          alt="Avatar"
          className="w-28 h-28 rounded-full border-4 border-white"
        />
        <div>
          <h1 className="text-2xl font-bold">{channel.fullName}</h1>
          <p className="text-gray-500">@{channel.userName}</p>
          <p className="text-gray-600">
            {channel.subscribersCount} subscribers • {channel.subscribedToCount} subscriptions
          </p>
        </div>
      </div>

      {/* More details */}
      <div className="max-w-5xl mx-auto px-4 mt-6">
        <p>Email: {channel.email}</p>
        <p>Joined: {new Date(channel.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
