import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import Comment from "../components/Comment";
import VideoCard from "../components/VideoCard";

export default function VideoDetail() {
  const { id } = useParams(); // video ID from URL
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fetch video detail
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`/videos/${id}`);
        setVideo(res.data);
      } catch (err) {
        console.error("Failed to fetch video:", err);
      }
    };

    // Fetch comments for this video
    const fetchComments = async () => {
      try {
        const res = await axios.get(`/videos/${id}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      }
    };

    fetchVideo();
    fetchComments();
  }, [id]);

  const handleCommentClick = (comment) => {
    console.log("Clicked comment:", comment);
    // Navigate to comment thread or reply form
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
            key={comment.id}
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
