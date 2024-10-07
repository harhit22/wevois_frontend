import React, { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./ProjectDashBoard.css";
import Navbar from "../../components/basic/navbar/navbar";
import {
  BsImage,
  BsUpload,
  BsTag,
  BsFileEarmarkSlidesFill,
} from "react-icons/bs";
import UploadDatasetForm from "../uploadData/uploadData";
import { useNavigate } from "react-router-dom";
import UploadImage from "../../components/UploadImage/UploadImage";
import OriginalImageGallery from "../../components/OriginalImageGallery/OriginalImageGallery";
import LabelImageGallery from "../../components/LabelImageGallery/LabelImageGallery";
import AnnotedImageGallery from "../../components/AnnotedImageGallery/AnnotedImageGallery";
import UploadVideo from "../../components/UploadVideo/UploadVideo";

const ProjectDashBoard = () => {
  const { projectId } = useParams();
  const [selectedSidebarItem, setSelectedSidebarItem] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Check for token and redirect to login if not found
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page if no token is found
    }
  }, [navigate]);

  const handleSidebarItemClick = (item) => {
    setSelectedSidebarItem(item);
  };

  return (
    <>
      <Navbar />
      <div className="row">
        <nav className="col-md-2 d-none d-md-block bg-dark sidebar">
          <div className="sidebar-sticky">
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

              <li className="nav-item">
                <NavLink
                  className={`nav-link ${
                    selectedSidebarItem === "Annotations" ? "active" : ""
                  }`}
                  onClick={() => handleSidebarItemClick("Annotations")}
                >
                  <BsImage className="sidebar-icon" /> Annotation
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className={`nav-link ${
                    selectedSidebarItem === "UploadData" ? "active" : ""
                  }`}
                  onClick={() => handleSidebarItemClick("UploadData")}
                >
                  <BsUpload className="sidebar-icon" /> Upload Data
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className={`nav-link ${
                    selectedSidebarItem === "UploadImage" ? "active" : ""
                  }`}
                  onClick={() => handleSidebarItemClick("UploadImage")}
                >
                  <BsImage className="sidebar-icon" /> Upload Image
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className={`nav-link ${
                    selectedSidebarItem === "UploadVideo" ? "active" : ""
                  }`}
                  onClick={() => handleSidebarItemClick("UploadVideo")}
                >
                  <BsImage className="sidebar-icon" /> Upload Video
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className={`nav-link ${
                    selectedSidebarItem === "Original Images" ? "active" : ""
                  }`}
                  onClick={() => handleSidebarItemClick("Original Images")}
                >
                  <BsFileEarmarkSlidesFill className="sidebar-icon" /> Original
                  Images
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className={`nav-link ${
                    selectedSidebarItem === "Annotated Images" ? "active" : ""
                  }`}
                  onClick={() => handleSidebarItemClick("Annotated Images")}
                >
                  <BsTag className="sidebar-icon" /> Annotated Images
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  className={`nav-link ${
                    selectedSidebarItem === "Labeled Images" ? "active" : ""
                  }`}
                  onClick={() => handleSidebarItemClick("Labeled Images")}
                >
                  <BsUpload className="sidebar-icon" /> Labeled Images
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
        <main
          role="main"
          className="col-md-9 ml-sm-auto col-lg-10 px-4 ms-1 main"
        >
          <div className="row">
            {selectedSidebarItem === "Annotations" && (
              <>
                <div className="col-lg-4 col-md-6 mb-4 mt-2">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">Annotated Images</h5>
                      <hr />
                      <p className="card-text">
                        Here you can view and annotate images for this project
                        and start giving labels.
                      </p>
                      <NavLink
                        className="btn btn-primary"
                        to={`/annotedImages/${projectId}`}
                      >
                        View Images
                      </NavLink>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4 mt-2">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">Unannotated Images</h5>
                      <hr />
                      <p className="card-text">
                        Here you can view unannotated images for this project
                        and start drawing boxes.
                      </p>
                      <NavLink
                        className="btn btn-primary"
                        to={`/UnannotedImages/${projectId}`}
                      >
                        View Images
                      </NavLink>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="row">
            {selectedSidebarItem === "UploadData" && (
              <>
                <UploadDatasetForm />
              </>
            )}
          </div>

          <div className="row">
            {selectedSidebarItem === "UploadImage" && (
              <>
                <UploadImage />
              </>
            )}
          </div>

          <div className="row">
            {selectedSidebarItem === "UploadVideo" && (
              <>
                <UploadVideo />
              </>
            )}
          </div>

          <div className="row">
            {selectedSidebarItem === "Original Images" && (
              <>
                <OriginalImageGallery path="all-images" />
              </>
            )}
          </div>

          <div className="row">
            {selectedSidebarItem === "Annotated Images" && (
              <>
                <AnnotedImageGallery
                  path="annotated-images"
                  projectId={projectId}
                />
              </>
            )}
          </div>

          <div className="row">
            {selectedSidebarItem === "Labeled Images" && (
              <>
                <LabelImageGallery
                  path="labeled-images"
                  projectId={projectId}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ProjectDashBoard;
