import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./UploadImage.css";
import Loader from "../../components/ui/Loader/Loader";
import { BaseURL } from "../../constant/BaseUrl";

const UploadImage = () => {
  const { projectId } = useParams();
  const [selectedImage, setSelectedImage] = useState(null); // State for image file
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  // Handle file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setUploadError(null);
    } else {
      setSelectedImage(null);
      setUploadError("No file selected");
    }
  };

  // Handle form submission and API call
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setUploadError(null);
    setUploadSuccess(false);

    // Create FormData to send file via POST request
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      // Call the backend API to upload image
      const response = await fetch(
        `${BaseURL}project/upload/api/${projectId}/upload_image/`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        setUploadSuccess(true);
        setSelectedImage(null); // Reset file selection

        // Show success message for a few seconds
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        setUploadError(result.error || "Failed to upload image");
      }
    } catch (error) {
      setUploadError("An error occurred while uploading the image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-main-div mt-2">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title">Upload Image</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="imageInput">Choose an image file:</label>
              <br />
              <input
                type="file"
                accept="image/*" // Accept all image types
                className="form-control"
                id="imageInput"
                onChange={handleFileChange}
                disabled={loading} // Disable input while loading
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-3"
              disabled={loading || !selectedImage} // Disable button while loading or if no file selected
            >
              {loading ? <Loader /> : "Upload Image"}
            </button>
          </form>
          {uploadError && (
            <div className="alert alert-danger mt-3">{uploadError}</div>
          )}
          {uploadSuccess && (
            <div className="alert alert-success mt-3">
              Image uploaded successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
