// src/api/fetchProjectsCategory.js
import { BaseURL } from "../../constant/BaseUrl";
export const fetchProjectsCategory = async (
  projectId,
  setProjetCategory,
  setError
) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${BaseURL}project/${projectId}/categories/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch projects.");
    }

    const data = await response.json();
    setProjetCategory(data);
  } catch (error) {
    console.error("Error:", error);
  }
};
