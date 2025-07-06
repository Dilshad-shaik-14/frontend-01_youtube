import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideoById, getVideoComments } from "../../Index/api";
import Comment from "../../components/Comment";
import VideoCard from "../../components/VideoCard";

export default function VideoDetail() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await getVideoById(id);
        setVideo(res.video);
      } catch (err) {
        console.error("Failed to fetch video:", err);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await getVideoComments({ videoId: id, page: 1 });
        setComments(res.comments || []);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };

    fetchVideo();
    fetchComments();
  }, [id]);

  const handleCommentClick = (comment) => {
    console.log("Clicked comment:", comment);
    // Handle comment click (reply, navigate, etc.)
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {video && (
        <div className="mb-4">
          <VideoCard video={video} />
        </div>
      )}

      <h3 className="text-lg font-semibold mt-6 mb-3">Comments</h3>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            onClick={handleCommentClick}
          />
        ))
      ) : (
        <p className="text-sm text-zinc-500">No comments yet.</p>
      )}
    </div>
  );
}
