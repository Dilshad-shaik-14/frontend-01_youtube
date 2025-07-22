import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserTweets } from "../../Index/api";
import EditableTweetCard from "../../components/EditableTweetCard";

export default function TweetDetail() {
  const { id } = useParams();
  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        const res = await getUserTweets(id);
        setTweet(res.tweet);
      } catch (err) {
        console.error("Failed to fetch tweet:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTweet();
  }, [id]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading tweet...</div>;
  }

  if (!tweet) {
    return <div className="text-center text-red-500">Tweet not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <EditableTweetCard tweet={tweet} editable={true} />
    </div>
  );
}
