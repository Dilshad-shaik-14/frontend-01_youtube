import React from 'react';

const Comment = ({ comment, onClick }) => {
  const {
    content,
    video,
    owner = {},
    likesCount = 0, // If provided by API
  } = comment;

  return (
    <div
      className='rounded-lg shadow bg-white dark:bg-zinc-900 p-4 mb-4 cursor-pointer hover:shadow-lg transition'
      onClick={() => onClick && onClick(comment)}
    >
      {/* User Info */}
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

      {/* Content */}
      <div className="mb-2 text-sm text-zinc-700 dark:text-zinc-200">
        {content}
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs text-zinc-500">
        <span>{likesCount} Likes</span>
        {video?.title && <span>on "{video.title}"</span>}
      </div>
    </div>
  );
};

export default Comment;
