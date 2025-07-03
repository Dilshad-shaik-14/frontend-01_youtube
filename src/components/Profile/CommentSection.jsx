import React, { useState, useEffect } from 'react';
import axios from "axios";
import Comment from "../Comment";

const CommentSection = ({ userId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        const res = await axios.get(`/comments?owner=${userId}`);
        console.log("Comment API response:", res.data);

        // Fix: Always ensure an array
        setComments(Array.isArray(res.data) ? res.data : res.data.comments || []);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        setComments([]); // fallback on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserComments();
  }, [userId]);

  if (loading) return <p className='text-zinc-500'>Loading comments...</p>;
  if (comments.length === 0) return <p className='text-zinc-500'>No comments yet!</p>;

  return (
    <div className='space-y-4'>
      {comments.map((com) => (
        <Comment key={com._id} comment={com} />
      ))}
    </div>
  );
}

export default CommentSection;
