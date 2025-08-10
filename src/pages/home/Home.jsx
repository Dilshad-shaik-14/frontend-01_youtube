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

const user = useSelector((state) => state.auth.currentUser); // ✅

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [videoRes, tweetRes, userRes] = await Promise.all([
          getAllVideos({ limit: 6, page: 1 }),
          getAllTweets({ limit: 4, page: 1, userId: user?._id }), // ✅ pass userId
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

    if (user?._id) fetchContent(); // ✅ ensure user is available
  }, [user?._id]);

  const theme = useSelector((state) => state.auth.theme);

  const SectionWrapper = ({ title, children }) => (
    <section className="bg-white/80 dark:bg-zinc-900/70 backdrop-blur-lg rounded-3xl px-6 py-8 shadow-xl border border-zinc-200 dark:border-zinc-700 w-full space-y-6 transition-all duration-300">
      <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-white tracking-tight mb-4 border-b-2 border-red-500 pb-2 w-fit">
        {title}
      </h2>
      {children}
    </section>
  );

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {error && (
        <div className="text-red-600 bg-red-100 p-4 rounded-xl shadow border border-red-200">
          {error}
        </div>
      )}

      {/* Videos Section */}
      <SectionWrapper title="Recommended Videos">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonVideoCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <EditableVideoCard key={video._id} video={video} editable={false} />
            ))}
          </div>
        )}
      </SectionWrapper>

      {/* Tweets Section */}
      <SectionWrapper title="Latest Tweets">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonTweetCard key={i} />
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
              <SkeletonCard key={i} />
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
              />
            ))}
          </div>
        )}
      </SectionWrapper>
    </div>
  );
}
