import React, { useEffect, useState } from "react";
import {
  getAllVideos,
  getTweets,
  suggestUsers
} from "../../Index/api"; 
import VideoCard from "../../components/VideoCard";
import TweetCard from "../../components/TweetCard";
import {
  SkeletonCard,
  SkeletonTweetCard,
  SkeletonVideoCard
} from "../../layout/SkeletonCard";

const UserCard = ({ user }) => (
  <div className="p-3 rounded-lg shadow bg-white dark:bg-zinc-800 flex items-center gap-3 border border-zinc-200 dark:border-zinc-700">
    <img
      src={user.avatar || "/default-avatar.png"}
      alt={user.username}
      className="w-10 h-10 rounded-full object-cover border border-red-500"
    />
    <div>
      <div className="font-semibold text-zinc-800 dark:text-zinc-100">{user.fullName}</div>
      <div className="text-xs text-zinc-500">@{user.username}</div>
    </div>
  </div>
);

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [videoRes, tweetRes, userRes] = await Promise.all([
          getAllVideos({ limit: 6, page: 1 }),
          getTweets({ page: 1 }),
          suggestUsers()
        ]);

        setVideos(videoRes.videos || []);
        setTweets(tweetRes.tweets || []);
        setSuggestedUsers(userRes.users || []);
      } catch (err) {
        console.error("Error loading home feed:", err);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-12">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
            Suggested Users
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
            Latest Videos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonVideoCard key={i} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
            Tweets Feed
          </h2>
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonTweetCard key={i} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-12">
      {/* Suggested Users */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
          Suggested Users
        </h2>
        {suggestedUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {suggestedUsers.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No suggestions right now.</p>
        )}
      </section>

      {/* Videos */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
          Latest Videos
        </h2>
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No videos yet.</p>
        )}
      </section>

      {/* Tweets */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
          Tweets Feed
        </h2>
        {tweets.length > 0 ? (
          <div className="flex flex-col gap-4">
            {tweets.map((tweet) => (
              <TweetCard key={tweet._id} tweet={tweet} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No tweets yet.</p>
        )}
      </section>
    </div>
  );
}
