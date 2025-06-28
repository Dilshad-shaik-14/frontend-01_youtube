import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../src/api";
import TweetCard from "../components/TweetCard";

export default function TweetDetail() {
  const { id } = useParams();
  const [tweet, setTweet] = useState(null);

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        const res = await axios.get(`/tweets/${id}`);
        setTweet(res.data);
      } catch (err) {
        console.error("Failed to fetch tweet:", err);
      }
    };

    fetchTweet();
  }, [id]);

  if (!tweet) {
    return <div className="text-center text-gray-500">Loading tweet...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <TweetCard tweet={tweet} />

    </div>
  );
}
