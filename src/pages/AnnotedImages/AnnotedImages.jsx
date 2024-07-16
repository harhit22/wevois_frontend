import React, { useState, useEffect } from "react";
import Navbar from "../../components/basic/navbar/navbar";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";

const AnnotatedImages = () => {
  const { projectId } = useParams();
  const [projectCategory, setProjetCategory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchProjectsCategory = async () => {
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
        console.log(data, "empty");
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProjectsCategory();
  }, [projectId]);

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row dash_back">
          <nav className="col-md-2 d-none d-md-block sidebar_background sidebar sidebar-category">
            <div className="sidebar-sticky">
              <h5 className="sidebar-heading ">Projects</h5>
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
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{cat.category}</h5>
                      <hr />
                      <p className="card-text">
                        Here you can view and Label images for {cat.category}{" "}
                        category.
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
