import React, { useEffect, useState } from 'react'
import axios from 'axios'
import VideoCard from '../VideoCard'

const VideoSection = ({userId}) => {

    const [videos, setVideo] = useState([]);
    const [ loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserVideos = async() => {
            try {
                const res = axios.get(`/videos?owner = ${userId}`);
                setVideo(res.data);
                
            } 
            catch (error) {
                console.error(`error while fetching videos: ${error}`)
            }
            finally{
                setLoading(false);
            }
        };
        
        fetchUserVideos();
    }, [ userId ]);

 if (loading) return <p className="text-zinc-500">Loading videos...</p>;

  if (videos.length === 0) return <p className="text-zinc-500">No videos uploaded yet.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
}

export default VideoSection
