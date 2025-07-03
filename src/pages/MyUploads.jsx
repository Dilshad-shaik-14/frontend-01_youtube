import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoCard from "../components/VideoCard";
import TweetCard from "../components/TweetCard";

export default function UploadsPage({ userId }) {
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const [videoRes, tweetRes] = await Promise.all([
          axios.get(`/api/v1/videos?owner=${userId}`),
          axios.get(`/api/v1/tweets?owner=${userId}`),
        ]);

        setVideos(videoRes.data || []);
        setTweets(tweetRes.data || []);
      } catch (err) {
        console.error("Failed to fetch uploads:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUploads();
  }, [userId]);

  if (loading) return <p className="text-zinc-500 text-center">Loading uploads...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4 text-red-500">Uploaded Videos</h2>
        {videos.length === 0 ? (
          <p className="text-zinc-500">No videos uploaded yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-red-500">Tweetz</h2>
        {tweets.length === 0 ? (
          <p className="text-zinc-500">No tweetz posted yet.</p>
        ) : (
          <div className="space-y-4">
            {tweets.map((tweet) => (
              <TweetCard key={tweet._id} tweet={tweet} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
