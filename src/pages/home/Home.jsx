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
import UserCard from "../../components/UserCard";

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

      console.log("videos:", videoRes);
      console.log("tweets:", tweetRes);
      console.log("users:", userRes);

      // ✅ FIXED: Access .data.videos, .data.tweets
      setVideos(videoRes?.data?.videos || []);
      setTweets(tweetRes?.data?.tweets || []);
      setSuggestedUsers(userRes?.data || []);
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

  if (error && videos.length === 0 && tweets.length === 0 && suggestedUsers.length === 0) {
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
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No suggestions right now.
          </p>
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
