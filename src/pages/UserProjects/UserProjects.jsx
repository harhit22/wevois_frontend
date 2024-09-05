import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./UserProject.css";
import Navbar from "../../components/basic/navbar/navbar";
import fetchProjects from "../../pages_services/UserProjects/FetchProjects/FetchProjects";
import URLs from "../../constant/url";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [inviteProjectId, setInviteProjectId] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  useEffect(() => {
    const getProjects = async () => {
      const data = await fetchProjects();
      setProjects(data);
    };

    getProjects();
  }, []);

  const handleInvite = async (projectId) => {
    try {
      const response = await fetch(
        `${URLs.PROJECT_URL}api/${projectId}/invite/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ email: inviteEmail }),
        }
      );
      if (response.ok) {
        setInviteSuccess("Invitation sent successfully!");
        setInviteError("");
      } else {
        const errorData = await response.json();
        setInviteError(errorData.email || "Failed to send invitation.");
        setInviteSuccess("");
      }
    } catch (error) {
      setInviteError("Failed to send invitation.");
      setInviteSuccess("");
    }
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
                  <div className="card-footer d-flex justify-content-between">
                    <NavLink
                      className="btn btn-primary main-project-btn"
                      to={`/ProjectDashBoard/${project.id}`}
                    >
                      Project
                    </NavLink>
                    <button
                      className="btn btn-primary main-project-btn"
                      onClick={() => setInviteProjectId(project.id)}
                    >
                      Invite
                    </button>
                  </div>
                </div>
                {inviteProjectId === project.id && (
                  <div className="invite-form mt-3">
                    <input
                      type="email"
                      className="form-control mb-2"
                      placeholder="Enter email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                    <button
                      className="btn btn-success"
                      onClick={() => handleInvite(project.id)}
                    >
                      Send Invitation
                    </button>
                    {inviteError && (
                      <div className="alert alert-danger mt-2">
                        {inviteError}
                      </div>
                    )}
                    {inviteSuccess && (
                      <div className="alert alert-success mt-2">
                        {inviteSuccess}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default ProjectList;
