import React from 'react'

const TweetCard = ({ tweet, onClick }) => {
  const {
    content,
    owner = {},
    likesCount = 0,
    commentsCount = 0,
    retweetsCount = 0,
  } = tweet

  return (
    <div
      className="rounded-lg shadow bg-white dark:bg-zinc-900 p-4 mb-4 cursor-pointer hover:shadow-lg transition"
      onClick={() => onClick && onClick(tweet)}
    >
      <div className="flex items-center mb-2">
        <img
          src={owner.avatar}
          alt={owner.username}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <div className="font-semibold">{owner.fullName}</div>
          <div className="text-xs text-zinc-500">@{owner.username}</div>
        </div>
      </div>
      <div className="mb-2 text-sm">{content}</div>

      <div className="flex gap-4 text-xs text-zinc-500">
        <span>{likesCount} Likes</span>
        <span>{retweetsCount} Retweets</span>
        <span>{commentsCount} Comments</span>
      </div>
    </div>
  )
}

export default TweetCard
