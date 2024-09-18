// src/utils/fileUtils.js
import URLs from "../../constant/url";

export const handleFileChange = (event, setSelectedFile, setUploadError) => {
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

// src/utils/uploadUtils.js
export const handleUpload = async (
  event,
  projectId,
  selectedFile,
  setUploadSuccess,
  setUploadError
) => {
  event.preventDefault();
  if (!selectedFile) {
    setUploadError("Please select a file");
    return;
  }

  const formData = new FormData();
  formData.append("dataset", selectedFile);

  try {
    const response = await fetch(
      `${URLs.PROJECT_UPLOAD_URL}api/${projectId}/upload_dataset/`,
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
