// src/api/fetchProjects.js
import URLs from "../../../constant/url";
const fetchProjects = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${URLs.PROJECT_URL}projects/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch projects.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

export default fetchProjects;
