import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  handleFileChange,
  handleUpload,
} from "../../utils/uploadData/uploadutils";
import "./uploadData.css";
import Loader from "../../components/ui/Loader/Loader";

const UploadDatasetForm = () => {
  const { projectId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission
    setLoading(true); // Set loading to true when upload starts
    handleUpload(
      event,
      projectId,
      selectedFile,
      setUploadSuccess,
      setUploadError
    )
      .then(() => {
        setUploadSuccess(true);

        setTimeout(() => {
          setUploadSuccess(false); // Reset success message
        }, 3000);
      })
      .finally(() => setLoading(false)); // Reset loading to false after upload
  };

  return (
    <div className="upload-main-div mt-2">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title">Upload Dataset</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fileInput">Choose a zip file:</label>
              <br />
              <input
                type="file"
                accept=".zip"
                className="form-control"
                id="fileInput"
                onChange={(event) =>
                  handleFileChange(event, setSelectedFile, setUploadError)
                }
                disabled={loading} // Disable input while loading
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary mt-3"
              disabled={loading || !selectedFile} // Disable button while loading or if no file selected
            >
              {loading ? <Loader /> : "Upload Dataset"}
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
