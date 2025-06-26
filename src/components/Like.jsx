import React from 'react'
import React from 'react';

const Like = ({ Like, onClick }) => {
  const {
    video,
    comment,
    tweet,
    likedBy = {},
  } = Like;

  // Determine type of like
  const likeType = video ? 'Video' : tweet ? 'Tweet' : 'Comment';

  // Get content preview (optional)
  const contentPreview = video?.title || tweet?.content || comment?.content;

  return (
    <div
      className='rounded-lg shadow bg-white dark:bg-zinc-900 p-4 mb-4 cursor-pointer hover:shadow-lg transition'
      onClick={() => onClick && onClick(Like)}
    >
      {/* User Info */}
      <div className='flex items-center mb-2'>
        <img
          src={likedBy.avatar}
          alt={likedBy.username}
          className='w-8 h-8 rounded-full mr-2'
        />
        <div>
          <div className='font-semibold text-sm'>{likedBy.fullName}</div>
          <div className='text-xs text-zinc-500 dark:text-zinc-400'>
            @{likedBy.username} liked a {likeType}
          </div>
        </div>
      </div>

      {/* Preview of Liked Content */}
      <div className='text-sm text-zinc-700 dark:text-zinc-300'>
        {contentPreview?.slice(0, 100)}...
      </div>
    </div>
  );
};

export default Like;

