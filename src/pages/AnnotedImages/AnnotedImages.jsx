import React, { useState, useEffect } from "react";
import Navbar from "../../components/basic/navbar/navbar";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { fetchProjectsCategory } from "../../pages_services/AnnotatedImages/fetcgProjectCategory";
import { BaseURL } from "../../constant/BaseUrl";

const AnnotatedImages = () => {
  const { projectId } = useParams();
  const [projectCategory, setProjectCategory] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Check for token and redirect to login if not found
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page if no token is found
    }
  }, [navigate]);

  useEffect(() => {
    fetchProjectsCategory(projectId, setProjectCategory);
  }, [projectId]);

  const downloadDataset = async (categoryId, categoryName) => {
    console.log(categoryId, categoryName);
    try {
      // Construct the URL with query parameters
      const url = new URL(`${BaseURL}project/yolov8/download-dataset/`);
      url.searchParams.append("category_id", categoryId);
      url.searchParams.append("category_name", categoryName);

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle blob download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${categoryName}_dataset.zip`); // Use category name in the filename
      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up
    } catch (error) {
      console.error("Error downloading dataset:", error);
      alert("Failed to download dataset. Please try again."); // User feedback for errors
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row dash_back">
          <nav className="col-md-2 d-none d-md-block sidebar_background sidebar sidebar-category">
            <div className="sidebar-sticky">
              <h5 className="sidebar-heading">Projects</h5>
              <ul className="nav flex-column">
                <li>
                  <img
                    src="https://t3.ftcdn.net/jpg/05/90/82/32/360_F_590823233_97YNah2bYsEW9llwf7UNK5L3r1cM0Ei3.jpg"
                    alt=""
                    width="80%"
                    style={{ paddingLeft: "30px" }}
                  />
                </li>
                <br />
                <hr />
              </ul>
            </div>
          </nav>
          <main className="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div className="row">
              {projectCategory.map((cat) => (
                <div className="col-lg-4 col-md-6 mb-4 mt-2" key={cat.id}>
                  <div className="card h-100 position-relative">
                    {/* Download button in top-right corner */}
                    <button
                      className="btn btn-outline-primary position-absolute top-0 end-0 mt-2 me-2"
                      onClick={() => downloadDataset(cat.id, cat.category)}
                    >
                      <i className="fa fa-download"></i>{" "}
                      {/* Font Awesome download icon */}
                    </button>

                    <div className="card-body">
                      <h5 className="card-title">{cat.category}</h5>
                      <hr />
                      <p className="card-text">
                        Here you can view and label images for the{" "}
                        {cat.category} category.
                      </p>
                      <NavLink
                        className="btn btn-primary"
                        to={`/labelCategory/${cat.id}/${cat.category}/${projectId}`}
                      >
                        {cat.category}
                      </NavLink>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AnnotatedImages;
