import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import URLs from "../../constant/url";
import "./UserProject.css";
import Navbar from "../../components/basic/navbar/navbar";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
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
        setProjects(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProjects();
  }, []);

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
            </ul>
          </div>
        </nav>
        <main
          role="main"
          className="col-md-9 ml-sm-auto col-lg-10 px-4 m-2 border pt-4"
        >
          <div className="d-flex justify-content-between mb-4">
            <img
              src="https://cdn-icons-png.freepik.com/256/12176/12176993.png?semt=ais_hybrid"
              width="3%"
              alt="xx"
            />
            <NavLink
              to="/CreateProject"
              className="btn btn-dark create-project-button"
            >
              Create Project
            </NavLink>
          </div>
          <div className="row">
            {projects.map((project) => (
              <div className="col-lg-4 col-md-6 mb-4" key={project.id}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{project.name}</h5>
                    <p className="card-text">{project.description}</p>
                  </div>
                  <div className="card-footer">
                    <NavLink
                      className="btn btn-primary main-project-btn"
                      to={`/ProjectDashBoard/${project.id}`}
                    >
                      Project
                    </NavLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default ProjectList;
