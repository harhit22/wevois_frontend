import React, { useState, useEffect } from "react";
import Navbar from "../../components/basic/navbar/navbar";
import { useParams } from "react-router-dom";
import Gallery from "../../components/Gallery/Gallery";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { BsTag } from "react-icons/bs";
import AnnotedImageGallery from "../../components/AnnotedImageGallery/AnnotedImageGallery";

const UnannotedImages = () => {
  const { projectId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [selectedSidebarItem, setSelectedSidebarItem] = useState(null);
  const handleSidebarItemClick = (item) => {
    setSelectedSidebarItem(item);
  };

  useEffect(() => {
    // Check for token and redirect to login if not found\

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page if no token is found
    }
    console.log();
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row dash_back">
          <nav className="col-md-2 d-none d-md-block sidebar_background sidebar sidebar-category">
            <div className="sidebar-sticky">
              <ul className="nav flex-column">
                <li>
                  <img
                    src="https://t3.ftcdn.net/jpg/05/90/82/32/360_F_590823233_97YNah2bYsEW9llwf7UNK5L3r1cM0Ei3.jpg"
                    alt=""
                    width="80%"
                    style={{ paddingLeft: "30px" }}
                  />
                  <br />
                </li>
                <br />
                <hr />
              </ul>
              <ul className="img_sec">
                <li className="point_sec">
                  <NavLink
                    className={`nav-link ${
                      selectedSidebarItem === "Gallary" ? "active" : ""
                    }`}
                    onClick={() => handleSidebarItemClick("Gallary")}
                  >
                    <BsTag className="sidebar-icon" /> Gallery
                  </NavLink>
                </li>
                <li className="point_sec">
                  <NavLink
                    className={`nav-link ${
                      selectedSidebarItem === "Annotated Images" ? "active" : ""
                    }`}
                    onClick={() => handleSidebarItemClick("Annotated Images")}
                  >
                    <BsTag className="sidebar-icon" /> Annote Images
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>
          <main className="col-md-9 ml-sm-auto col-lg-10 px-4 proper_section">
            <div className="row">
              {selectedSidebarItem === "Gallary" && (
                <>
                  <Gallery projectId={projectId} />
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
          </main>
        </div>
      </div>
    </>
  );
};

export default UnannotedImages;
