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

  const SectionWrapper = ({ title, children }) => (
    <section className="bg-white/90 dark:bg-zinc-900/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-zinc-200 dark:border-zinc-700 space-y-4">
      <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100 mb-2">
        {title}
      </h2>
      {children}
    </section>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        <SectionWrapper title="Suggested Users">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper title="Latest Videos">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonVideoCard key={i} />
            ))}
          </div>
        </SectionWrapper>

        <SectionWrapper title="Tweets Feed">
          <div className="flex flex-col gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonTweetCard key={i} />
            ))}
          </div>
        </SectionWrapper>
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
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Suggested Users */}
      <SectionWrapper title="Suggested Users">
        {suggestedUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {suggestedUsers.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No suggestions right now.
          </p>
        )}
      </SectionWrapper>

      {/* Videos */}
      <SectionWrapper title="Latest Videos">
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No videos yet.</p>
        )}
      </SectionWrapper>

      {/* Tweets */}
      <SectionWrapper title="Tweets Feed">
        {tweets.length > 0 ? (
          <div className="flex flex-col gap-6">
            {tweets.map((tweet) => (
              <TweetCard key={tweet._id} tweet={tweet} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">No tweets yet.</p>
        )}
      </SectionWrapper>
    </div>
  );
}
