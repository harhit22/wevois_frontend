import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./UploadVideo.css"; // Create this CSS file for styles
import Loader from "../../components/ui/Loader/Loader"; // Adjust the import based on your file structure
import { BaseURL } from "../../constant/BaseUrl";

const UploadVideo = () => {
  const { projectId } = useParams();
  const [selectedVideo, setSelectedVideo] = useState(null); // State for video file
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  // Handle file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedVideo(file);
      setUploadError(null);
    } else {
      setSelectedVideo(null);
      setUploadError("No file selected");
    }
  };

  // Handle form submission and API call
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setUploadError(null);
    setUploadSuccess(false);

    // Create FormData to send video via POST request
    const formData = new FormData();
    formData.append("video", selectedVideo);

    try {
      // Call the backend API to upload video
      const response = await fetch(
        `${BaseURL}project/upload/api/${projectId}/upload_video/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        setUploadSuccess(true);
        setSelectedVideo(null); // Reset file selection

        // Show success message for a few seconds
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setUploadError(result.error || "Failed to upload video");
      }
    } catch (error) {
      setUploadError("An error occurred while uploading the video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-main-div mt-2">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title">Upload Video</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="videoInput">Choose a video file:</label>
              <br />
              <input
                type="file"
                accept="video/*" // Accept all video types
                className="form-control"
                id="videoInput"
                onChange={handleFileChange}
                disabled={loading} // Disable input while loading
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-3"
              disabled={loading || !selectedVideo} // Disable button while loading or if no file selected
            >
              {loading ? <Loader /> : "Upload Video"}
            </button>
          </form>
          {uploadError && (
            <div className="alert alert-danger mt-3">{uploadError}</div>
          )}
          {uploadSuccess && (
            <div className="alert alert-success mt-3">
              Video uploaded successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadVideo;
