import React, { useEffect, useState } from "react";
import { getAllVideos, getAllTweets, suggestUsers } from "../../Index/api";

import EditableVideoCard from "../../components/EditableVideoCard";
import EditableTweetCard from "../../components/EditableTweetCard";
import {
  SkeletonCard,
  SkeletonTweetCard,
  SkeletonVideoCard,
} from "../../layout/SkeletonCard";

import UserCard from "../../components/UserCard";
import { useSelector } from "react-redux";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null); // for centered video player

  const user = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [videoRes, tweetRes, userRes] = await Promise.all([
          getAllVideos({ limit: 6, page: 1 }),
          getAllTweets({ limit: 4, page: 1, userId: user?._id }),
          suggestUsers(),
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

    if (user?._id) fetchContent();
  }, [user?._id]);

  const SectionWrapper = ({ title, children }) => (
    <section className="bg-white dark:bg-zinc-900/90 backdrop-blur-lg rounded-3xl px-6 py-8 shadow-2xl border border-zinc-200 dark:border-zinc-700 w-full space-y-6 transition-all duration-300 hover:shadow-3xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4 border-b-2 border-red-600 dark:border-red-500 pb-2 w-fit">
        {title}
      </h2>
      {children}
    </section>
  );

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 bg-gray-50 dark:bg-zinc-900">
      {error && (
        <div className="text-red-600 bg-red-100 p-4 rounded-xl shadow-lg border border-red-200 text-center font-semibold">
          {error}
        </div>
      )}

      {/* Videos Section */}
      <SectionWrapper title="Recommended Videos">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonVideoCard key={i} className="h-80" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => (
              <EditableVideoCard
                key={video._id}
                video={video}
                editable={false}
                className="relative overflow-hidden rounded-xl shadow-lg border border-zinc-300 dark:border-zinc-700 hover:shadow-2xl transition-transform duration-300 hover:scale-105 h-80 bg-white dark:bg-zinc-800 group cursor-pointer"
                onClick={() => setActiveVideo(video)}
              >
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-sm sm:text-base px-2 py-1 rounded-md font-semibold">
                  {video.duration || "0:00"}
                </span>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-4">
                  <h3 className="text-white font-bold text-base sm:text-lg line-clamp-2">
                    {video.title || "Untitled Video"}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    {video.channelName || "Unknown Channel"} •{" "}
                    {video.views ? `${video.views} views` : "0 views"}
                  </p>
                </div>
              </EditableVideoCard>
            ))}
          </div>
        )}
      </SectionWrapper>

      {/* Tweets Section */}
      <SectionWrapper title="Latest Tweets">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonTweetCard key={i} className="h-60" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {tweets.map((tweet) => (
              <EditableTweetCard
                key={tweet._id}
                tweet={tweet}
                editable={false}
                onRefresh={() => {
                  getUserTweets(user._id).then((res) =>
                    setTweets(res?.data?.tweets || [])
                  );
                }}
                className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-300 dark:border-zinc-700 hover:shadow-2xl transition-shadow duration-300 text-base sm:text-lg"
              />
            ))}
          </div>
        )}
      </SectionWrapper>

      {/* Suggested Users */}
      <SectionWrapper title="Suggested Users">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} className="h-56" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {suggestedUsers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                isExpanded={expandedUserId === user._id}
                onToggleExpand={() =>
                  setExpandedUserId((prev) =>
                    prev === user._id ? null : user._id
                  )
                }
                className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 shadow hover:shadow-lg transition-shadow duration-300"
              />
            ))}
          </div>
        )}
      </SectionWrapper>

      {/* Centered Video Player Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="w-full max-w-4xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={activeVideo.videoUrl}
              controls
              autoPlay
              className="w-full h-auto rounded-xl shadow-2xl"
            />
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold"
              onClick={() => setActiveVideo(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
