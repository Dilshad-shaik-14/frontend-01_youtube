export const uploadVideoToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "video_upload_preset");
  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dt7oflvcs/video/upload",
    { method: "POST", body: formData }
  );
  const data = await res.json();
  return data.secure_url;
};

export const uploadThumbnailToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "image_upload_preset");
  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dt7oflvcs/image/upload",
    { method: "POST", body: formData }
  );
  const data = await res.json();
  return data.secure_url;
};
