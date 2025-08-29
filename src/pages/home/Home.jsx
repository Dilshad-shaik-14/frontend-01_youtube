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
  const [activeVideo, setActiveVideo] = useState(null);

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

 // Section wrapper with scrollable content
const SectionWrapper = ({ title, children, className = "" }) => (
  <section
    className={
      "card bg-base-200 shadow-xl border border-base-300 w-full p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl rounded-2xl flex flex-col " +
      className
    }
  >
    <h2 className="card-title text-2xl sm:text-3xl font-bold text-base-content border-b-2 border-red-500 pb-2 w-fit mb-4">
      {title}
    </h2>

    {/* Scrollable content container */}
    <div className="flex-1 relative overflow-hidden">
    <div className="h-[600px] sm:h-[720px] overflow-y-auto pr-2 custom-scroll">
        {children}
      </div>

      {/* bottom fade effect */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-base-200 to-transparent" />
    </div>
  </section>
);


  return (
    <div className="max-w-screen-2xl mx-auto px-2 sm:px-6 lg:px-8 py-10 space-y-12 bg-base-100 text-base-content transition-colors duration-300 min-h-[calc(100vh-80px)] flex flex-col">
      {error && (
        <div className="alert alert-error shadow-lg">
          <span>{error}</span>
        </div>
      )}

      {/* Videos Section */}
      <SectionWrapper title="Recommended Videos">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl h-80 flex">
                <SkeletonVideoCard className="h-full w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <EditableVideoCard
                key={video._id}
                video={video}
                editable={false}
                className="card bg-base-100 border border-base-300 shadow-md hover:shadow-lg transition-transform duration-300 hover:scale-105 h-80 cursor-pointer overflow-hidden rounded-xl relative flex flex-col"
                onClick={() => setActiveVideo(video)}
              >
                {/* video duration badge */}
                <span className="absolute bottom-2 right-2 bg-base-300/80 text-base-content text-sm sm:text-base px-2 py-1 rounded-md font-semibold z-10">
                  {video.duration || "0:00"}
                </span>
                {/* bottom gradient/text block */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-base-300/90 via-transparent to-transparent p-4">
                  <h3 className="font-bold text-base sm:text-lg line-clamp-2 text-base-content">
                    {video.title || "Untitled Video"}
                  </h3>
                  <p className="text-base-content/70 text-xs sm:text-sm">
                    {video.channelName || "Unknown Channel"} •{" "}
                    {video.views
                      ? `${video.views} views`
                      : "0 views"}
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
              <div key={i} className="overflow-hidden rounded-xl h-60 flex">
                <SkeletonTweetCard className="h-full w-full rounded-xl" />
              </div>
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
                className="card bg-base-100 border border-base-300 shadow-md hover:shadow-lg p-6 text-base sm:text-lg rounded-xl overflow-hidden flex flex-col"
              />
            ))}
          </div>
        )}
      </SectionWrapper>

      {/* Suggested Users Section */}
      <SectionWrapper title="Suggested Users">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl h-56 flex">
                <SkeletonCard className="h-full w-full rounded-xl" />
              </div>
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
                  setExpandedUserId((prev) => (prev === user._id ? null : user._id))
                }
                className="card bg-base-100 border border-base-300 shadow-md hover:shadow-lg p-4 rounded-xl overflow-hidden flex flex-col"
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
              className="w-full h-auto rounded-xl shadow-2xl overflow-hidden"
            />
            <button
              className="btn btn-circle btn-error absolute top-4 right-4"
              onClick={() => setActiveVideo(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
