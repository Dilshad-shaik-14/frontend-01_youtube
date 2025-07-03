import React, { useEffect, useState } from 'react'
import axios from 'axios'
import VideoCard from '../VideoCard'

const VideoSection = ({ userId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserVideos = async () => {
      try {
        const res = await axios.get(`/videos?owner=${userId}`);
        setVideos(res.data || []); // in case res.data is undefined
      } catch (error) {
        console.error(`Error while fetching videos: ${error}`);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserVideos();
  }, [userId]);

  if (loading) return <p className="text-zinc-500">Loading videos...</p>;

  if (!Array.isArray(videos) || videos.length === 0)
    return <p className="text-zinc-500">No videos uploaded yet.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default VideoSection;
