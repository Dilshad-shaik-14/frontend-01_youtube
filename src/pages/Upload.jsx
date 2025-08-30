import React, { useState } from "react";
import { createTweet, publishAVideo } from "../Index/api";
import { Loader2, Video, MessageSquare } from "lucide-react";
import { useSelector } from "react-redux";

// Cloudinary upload functions (already defined elsewhere)
import { uploadVideoToCloudinary, uploadThumbnailToCloudinary } from "../utils/cloudinary";

const Upload = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("video");
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    videoFile: null,
    thumbnail: null,
  });
  const [previewThumb, setPreviewThumb] = useState(null);
  const [tweetText, setTweetText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0); // ⬅️ Added progress state

  const handleVideoChange = (e) => {
    const { name, value, files } = e.target;
    const file = files?.[0];

    if (name === "thumbnail" && file) {
      setPreviewThumb(URL.createObjectURL(file));
    }

    setVideoData((prev) => ({
      ...prev,
      [name]: file || value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");
  setProgress(0); // reset progress

  try {
    if (activeTab === "video") {
      const videoFile = videoData.videoFile;
      if (!videoFile) throw new Error("Video file is missing");

      const formData = new FormData();
      formData.append("file", videoFile);
      formData.append("upload_preset", "video_upload_preset");

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://api.cloudinary.com/v1_1/dt7oflvcs/video/upload");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setProgress(percentComplete);
          }
        };

        xhr.onload = async () => {
          if (xhr.status === 200) {
            const videoUrl = JSON.parse(xhr.responseText).secure_url;
            const thumbnailUrl = await uploadThumbnailToCloudinary(videoData.thumbnail);

            await publishAVideo({
              title: videoData.title,
              description: videoData.description,
              videoFile: videoUrl,
              thumbnail: thumbnailUrl,
            });

            setMessage("✅ Video uploaded successfully!");
            setVideoData({ title: "", description: "", videoFile: null, thumbnail: null });
            setPreviewThumb(null);
            setProgress(0);
            resolve();
          } else {
            reject(new Error("Video upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Video upload failed"));
        xhr.send(formData);
      });
    } else {
      await createTweet({ content: tweetText });
      setMessage("✅ Tweet posted successfully!");
      setTweetText("");
    }
  } catch (err) {
    console.error(err);
    setMessage("❌ Upload failed. Please try again.");
    setProgress(0);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 dark:bg-base-300 p-6">
      <div className="w-full max-w-xl space-y-10 rounded-3xl bg-base-100 dark:bg-base-200 p-10 shadow-xl border border-base-300">
        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          {["video", "tweet"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all
                ${activeTab === tab
                  ? "bg-red-500 text-white ring-2 ring-red-500"
                  : "bg-base-200 dark:bg-base-300 text-base-content hover:bg-red-500 hover:text-white"}`}
            >
              {tab === "video" ? <Video size={18} /> : <MessageSquare size={18} />}
              {tab === "video" ? "Upload Video" : "Post Tweet"}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center w-full">
          {activeTab === "video" && (
            <>
              <input
                name="title"
                placeholder="🎬 Video Title"
                required
                value={videoData.title}
                onChange={handleVideoChange}
                className="input input-bordered w-full rounded-full text-base-content bg-base-100 dark:bg-base-200 focus:ring-red-500 focus:border-red-500"
              />

              <textarea
                name="description"
                placeholder="📝 Description"
                rows="3"
                value={videoData.description}
                onChange={handleVideoChange}
                className="textarea textarea-bordered w-full rounded-2xl text-base-content bg-base-100 dark:bg-base-200 focus:ring-red-500 focus:border-red-500"
              />

              <div className="space-y-3 w-full">
                <label className="block text-sm font-medium text-base-content/70">📹 Select Video File</label>
                <input
                  type="file"
                  name="videoFile"
                  accept="video/*"
                  onChange={handleVideoChange}
                  required
                  className="file-input file-input-bordered w-full file:bg-red-500 file:text-white file:border-none file:rounded-full hover:file:bg-red-600"
                />

                <label className="block text-sm font-medium text-base-content/70">🖼️ Upload Thumbnail</label>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleVideoChange}
                  required
                  className="file-input file-input-bordered w-full file:bg-red-500 file:text-white file:border-none file:rounded-full hover:file:bg-red-600"
                />

                {previewThumb && (
                  <img
                    src={previewThumb}
                    alt="Thumbnail Preview"
                    className="rounded-2xl mt-2 w-full max-h-48 object-cover shadow"
                  />
                )}

                {/* Progress Bar */}
                {progress > 0 && (
                  <div className="w-full bg-red-200 rounded-full h-3 mt-2">
                    <div
                      className="bg-red-500 h-3 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "tweet" && (
            <textarea
              placeholder="💬 What's on your mind?"
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              rows="4"
              maxLength="280"
              required
              className="textarea textarea-bordered w-full rounded-2xl text-base-content bg-base-100 dark:bg-base-200 focus:ring-red-500 focus:border-red-500"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn bg-red-500 text-white btn-wide rounded-full flex justify-center items-center gap-2 hover:bg-red-600"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Processing..." : activeTab === "video" ? "Upload Video" : "Post Tweet"}
          </button>

          {message && (
            <p
              className={`text-center text-sm mt-2 font-medium ${
                message.startsWith("✅") ? "text-success animate-pulse" : "text-error animate-shake"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Upload;
