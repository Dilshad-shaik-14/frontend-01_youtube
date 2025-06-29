import React, { useState } from 'react'
import CommentSection from "../Profile/CommentSection"
import TweetSection from "../Profile/TweetSection"
import VideoSection from "../Profile/VideoSection"
import LikeSection from "../Profile/LikeSection"
import PlaylistSection from "../Profile/PlaylistSection"
import SubscriptionSection from "../Profile/SubscriptionSection"

const TABS = ["Tweets", "Videos", "Comments", "Likes", "Playlists", "Subscriptions"];

export default function Tabs({ userId }) {
  const [activeTab, setActiveTab] = useState("Tweets");

  return (
    <div>
      
      <div className="flex gap-4 border-b border-zinc-300 dark:border-zinc-700 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-blue-500 text-blue-500"
                : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {activeTab === "Tweets" && <TweetSection userId={userId} />}
        {activeTab === "Videos" && <VideoSection userId={userId} />}
        {activeTab === "Comments" && <CommentSection userId={userId} />}
        {activeTab === "Likes" && <LikeSection userId={userId} />}
        {activeTab === "Playlists" && <PlaylistSection userId={userId} />}
        {activeTab === "Subscriptions" && <SubscriptionSection userId={userId} />}
      </div>
    </div>
  );
}

