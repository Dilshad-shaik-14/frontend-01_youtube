// src/components/CommentSection.jsx
import React, { useState, useEffect } from "react";
import { getVideoComments } from "../Index/api";
import Comment from "../components/Comment";

const CommentSection = ({ userId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        const data = await getVideoComments(userId);
        // Ensure the response is an array
        setComments(Array.isArray(data) ? data : data.comments || []);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserComments();
  }, [userId]);

  if (loading) return <p className="text-zinc-500">Loading comments...</p>;
  if (comments.length === 0) return <p className="text-zinc-500">No comments yet!</p>;

  return (
    <div className="space-y-4">
      {comments.map((com) => (
        <Comment key={com._id} comment={com} />
      ))}
    </div>
  );
};

export default CommentSection;
