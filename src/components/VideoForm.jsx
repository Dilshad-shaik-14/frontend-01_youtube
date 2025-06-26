import React, { useState } from 'react';

const VideoForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [channelName, setChannelName] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !channelName || !thumbnail || !videoFile) return;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('channelName', channelName);
    formData.append('thumbnail', thumbnail);
    formData.append('video', videoFile);
    if (onSubmit) onSubmit(formData);
    setTitle('');
    setChannelName('');
    setThumbnail(null);
    setVideoFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          className="w-full px-3 py-2 rounded border border-zinc-300 dark:bg-zinc-800 dark:text-white"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Channel Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 rounded border border-zinc-300 dark:bg-zinc-800 dark:text-white"
          value={channelName}
          onChange={e => setChannelName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setThumbnail(e.target.files[0])}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Video File</label>
        <input
          type="file"
          accept="video/*"
          onChange={e => setVideoFile(e.target.files[0])}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
      >
        Upload Video
      </button>
    </form>
  );
};

export default VideoForm;
