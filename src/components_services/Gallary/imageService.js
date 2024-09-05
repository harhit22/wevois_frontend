// src/services/imageService.js

export const fetchNextImage = async (projectId) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/project/upload/api/${projectId}/next-image/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch the next image.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
