import React, { useEffect, useState } from 'react';
import { getLikedVideos } from '../../Index/api';
import VideoCard from '../../components/VideoCard';
import { SkeletonVideoCard } from  '../../layout/SkeletonCard';

const Like = () => {
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const response = await getLikedVideos();
        setLiked(response.data?.likedVideos || []);
      } catch (error) {
        console.error('Failed to fetch liked videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {loading ? (
        // Show 6 skeletons while loading
        Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonVideoCard key={idx} />
        ))
      ) : liked.length === 0 ? (
        <p>No liked videos found.</p>
      ) : (
        liked.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))
      )}
    </div>
  );
};

export default Like;
