import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getChannelVideos, getUserTweets } from "../Index/api";
import VideoCard from "../components/VideoCard";
import TweetCard from "../components/TweetCard";
import VideoPlayerModal from "../components/VideoPlayerModal";

export default function MyUploads() {
  const user = useSelector((state) => state.auth.currentUser);
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchUploads = async () => {
      if (!user || !user._id) return;

      try {
        const [videoRes, tweetRes] = await Promise.all([
          getChannelVideos(user._id), // ✅ channelId = user._id
          getUserTweets(user._id),    // ✅ userId = user._id
        ]);

        // Debug logs (optional)
        console.log("Videos Response:", videoRes);
        console.log("Tweets Response:", tweetRes);

        // ✅ Fix: videos are inside videoRes.data.videos
        setVideos(videoRes?.data?.videos || []);
        setTweets(tweetRes?.data?.tweets || []);
      } catch (error) {
        console.error("Error fetching uploads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUploads();
  }, [user]);

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold mb-4">My Uploads</h2>

      {/* Videos Section */}
      <section>
        <h3 className="text-xl font-semibold mb-2">My Videos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.length > 0 ? (
            videos.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                onClick={() => setSelectedVideo(video)}
              />
            ))
          ) : (
            <p>No videos uploaded.</p>
          )}
        </div>
      </section>

      {/* Tweets Section */}
      <section>
        <h3 className="text-xl font-semibold mb-2">My Tweets</h3>
        <div className="space-y-2">
          {tweets.length > 0 ? (
            tweets.map((tweet) => (
              <TweetCard key={tweet._id} tweet={tweet} />
            ))
          ) : (
            <p>No tweets posted.</p>
          )}
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
}
