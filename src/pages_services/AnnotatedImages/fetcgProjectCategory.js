// src/api/fetchProjectsCategory.js
export const fetchProjectsCategory = async (
  projectId,
  setProjetCategory,
  setError
) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/project/${projectId}/categories/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch projects.");
    }

    const data = await response.json();
    setProjetCategory(data);
  } catch (error) {
    console.error("Error:", error);
    setError(error.message);
  }
};
