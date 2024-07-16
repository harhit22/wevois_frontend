import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./uploadData.css"; // Import custom CSS for additional styling if needed

const UploadDatasetForm = () => {
  const { projectId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const fileType = file.type;
    if (
      fileType !== "application/zip" &&
      !file.name.toLowerCase().endsWith(".zip")
    ) {
      setUploadError("Please select a zip file");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setUploadError(null);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setUploadError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("dataset", selectedFile);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/project/upload/api/${projectId}/upload_dataset/`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        setUploadSuccess(true);
        setUploadError(null);
      } else {
        throw new Error("Failed to upload dataset");
      }
    } catch (error) {
      console.error("Error uploading dataset:", error);
      setUploadError("Failed to upload dataset");
    }
  };

  return (
    <div className="upload-main-div mt-2">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title">Upload Dataset</h3>
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label htmlFor="fileInput">Choose a zip file:</label>
              <br />
              <input
                type="file"
                accept=".zip"
                className="form-control"
                id="fileInput"
                onChange={handleFileChange}
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Upload Dataset
            </button>
          </form>
          {uploadError && (
            <div className="alert alert-danger mt-3">{uploadError}</div>
          )}
          {uploadSuccess && (
            <div className="alert alert-success mt-3">
              Dataset uploaded successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadDatasetForm;
