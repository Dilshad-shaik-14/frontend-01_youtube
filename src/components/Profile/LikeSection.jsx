import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import TweetCard from "../TweetCard";
import VideoCard from "../VideoCard";
import Comment from "../Comment";

export default function LikeSection({ userId }) {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/likes?likedBy=${userId}`).then((res) => {
      setLikes(res.data);
      setLoading(false);
    });
  }, [userId]);

  if (loading) return <p className="text-zinc-500">Loading likes...</p>;

  return (
    <div className="space-y-4">
      {likes.map((like) => {
        if (like.tweet) return <TweetCard key={like._id} tweet={like.tweet} />;
        if (like.video) return <VideoCard key={like._id} video={like.video} />;
        if (like.comment) return <Comment key={like._id} comment={like.comment} />;
        return null;
      })}
    </div>
  );
}
