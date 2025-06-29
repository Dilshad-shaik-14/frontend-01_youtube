import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoCard from "../components/VideoCard";
import TweetCard from "../components/TweetCard";

const UserCard = ({ user }) => (
  <div className="p-3 rounded shadow bg-white dark:bg-zinc-900 flex items-center gap-3">
    <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
    <div>
      <div className="font-semibold">{user.fullName}</div>
      <div className="text-xs text-zinc-500">@{user.username}</div>
    </div>
  </div>
);

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [videoRes, tweetRes, userRes] = await Promise.all([
          axios.get("/videos"),
          axios.get("/tweets"),
          axios.get("/suggestions"),
        ]);
        setVideos(Array.isArray(videoRes.data) ? videoRes.data : []);
        setTweets(Array.isArray(tweetRes.data) ? tweetRes.data : []);
        setSuggestedUsers(Array.isArray(userRes.data) ? userRes.data : []);
      } catch (err) {
        console.error("Error loading home feed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-zinc-500 dark:text-zinc-400">
        Loading your feed...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-10">
      {/* User Suggestions Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
          Suggested Users
        </h2>
        {Array.isArray(suggestedUsers) && suggestedUsers.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {suggestedUsers.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No suggestions right now.</p>
        )}
      </section>

      {/* Videos Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
          Latest Videos
        </h2>
        {Array.isArray(videos) && videos.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No videos yet.</p>
        )}
      </section>

      {/* Tweets Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
          Tweets Feed
        </h2>
        {Array.isArray(tweets) && tweets.length > 0 ? (
          <div className="space-y-4">
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