import React, { useEffect, useState } from "react";
import axios from "axios";
import TweetCard from "../TweetCard";

const TweetSection = ({ userId }) => {
  const [tweets, setTweets] = useState([]);
  const [ loading, setLoading] = useState(true);

 useEffect(() =>{
    const fetchUserTweets = async () => {
      try{
        const res =  await axios.get(`/tweet?owner=${userId}`);
        setTweets(res)
      }
      catch(error){
        console.error(`Failed to fetch tweets:${error}`)
      }
      finally{
        setLoading(false)
      }
    }
 }, [userId])

  if (loading) return <p className="text-zinc-500">Loading tweets...</p>;
  if (tweets.length === 0) return <p className="text-zinc-500">No tweets posted yet.</p>;

  
  return (
    <div className="space-y-4">
      {tweets.map((tweet) => (
        <TweetCard key={tweet._id} tweet={tweet} />
      ))}
    </div>
  );
};

export default TweetSection;
