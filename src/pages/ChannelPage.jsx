import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserChannelProfile } from "../Index/api";
import { Loader } from "../layout/SkeletonCard";

export default function ChannelPage() {
  const { userName } = useParams();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userName) return;

    async function fetchChannel() {
      try {
        const res = await getUserChannelProfile(userName);
        setChannel(res.data);
      } catch (err) {
        console.error("Error fetching channel:", err);
        setChannel(null);
      } finally {
        setLoading(false);
      }
    }

    fetchChannel();
  }, [userName]);

  if (loading) return <Loader />;
  if (!channel)
    return (
      <p className="text-center mt-10 text-gray-300 text-lg">
        Channel not found.
      </p>
    );

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f] text-white">
      {/* Cover Image */}
      <div className="w-full h-56 sm:h-64 md:h-72 lg:h-80 relative">
        {channel.coverImage ? (
          <img
            src={channel.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#1f1f1f]" />
        )}
      </div>

      {/* Channel Header */}
      <div className="max-w-6xl w-full mx-auto px-6 flex flex-col sm:flex-row items-center sm:items-end gap-6 mt-6">
        <img
          src={channel.avatar}
          alt="Avatar"
          className="w-32 h-32 rounded-full border-4 border-[#0f0f0f] shadow-lg"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold">{channel.fullName}</h1>
          <p className="text-gray-400 text-sm">@{channel.userName}</p>
          <p className="text-gray-300 text-sm mt-1">
            {channel.subscribersCount} subscribers •{" "}
            {channel.subscribedToCount} subscriptions
          </p>
        </div>
      </div>

      {/* Channel Info */}
      <div className="max-w-6xl w-full mx-auto px-6 mt-8 border-t border-[#2a2a2a] pt-6 space-y-2 flex-1">
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-white">Email:</span>{" "}
          {channel.email}
        </p>
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-white">Joined:</span>{" "}
          {channel.createdAt
            ? new Date(channel.createdAt).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
      {/* Tweets Section */}
{channel.tweets?.length > 0 && (
  <div className="max-w-6xl w-full mx-auto px-6 mt-8">
    <h2 className="text-2xl font-bold mb-4">Tweets</h2>
    <div className="space-y-4">
      {channel.tweets.map((tweet) => (
        <div key={tweet._id} className="p-4 bg-[#1f1f1f] rounded-lg">
          <p>{tweet.content}</p>
        </div>
      ))}
    </div>
  </div>
)}

{/* Videos Section */}
{channel.videos?.length > 0 && (
  <div className="max-w-6xl w-full mx-auto px-6 mt-8">
    <h2 className="text-2xl font-bold mb-4">Videos</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {channel.videos.map((video) => (
        <div key={video._id} className="bg-[#1f1f1f] rounded-lg overflow-hidden">
          <video
            src={video.videoFile}
            controls
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold">{video.title}</h3>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

    </div>
  );
}
