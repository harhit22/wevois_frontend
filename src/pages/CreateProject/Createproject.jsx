import React, { useState, useEffect } from "react";
import URLs from "../../constant/url";
import "./CreateProject.css";
import Navbar from "../../components/basic/navbar/navbar";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [inviteEmails, setInviteEmails] = useState([""]);
  const [message, setMessage] = useState("");
  const [errorData, setErrorData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token and redirect to login if not found
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page if no token is found
    }
  }, [navigate]);

  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleProjectDescriptionChange = (e) => {
    setProjectDescription(e.target.value);
  };

  const handleEmailChange = (index, e) => {
    const newInviteEmails = inviteEmails.map((email, i) =>
      i === index ? e.target.value : email
    );
    setInviteEmails(newInviteEmails);
  };

  const handleAddEmailField = () => {
    setInviteEmails([...inviteEmails, ""]);
  };

  const handleRemoveEmailField = (index) => {
    const newInviteEmails = inviteEmails.filter((_, i) => i !== index);
    setInviteEmails(newInviteEmails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      name: projectName,
      description: projectDescription,
    };

    try {
      const response = await fetch(`${URLs.PROJECT_URL}api/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Handle server errors
        if (response.status === 400) {
          console.log(errorData, "no data from backend");
          // Handle validation errors
          setErrorData(errorData); // Set the errors from the server
        } else {
          throw new Error("Failed to create project.");
        }
        return;
      }

      const data = await response.json();
      const createdProjectId = data.id;

      const invitationsData = {
        project_id: createdProjectId,
        emails: inviteEmails.filter((email) => email.trim() !== ""),
      };

      const invitationsResponse = await fetch(
        `${URLs.PROJECT_URL}api/${createdProjectId}/invite/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(invitationsData),
        }
      );

      if (invitationsResponse.ok) {
        setMessage("Project created and invitations sent!");
        navigate("/projectList");
      } else {
        const inviteErrorData = await invitationsResponse.json();
        setMessage("Failed to send invitations. " + inviteErrorData.detail);
      }
    } catch (error) {
      setMessage("An error occurred: " + error.message);
      console.error("Error:", error);
    }

    // Clear the form fields after submission
    setProjectName("");
    setProjectDescription("");
    setInviteEmails([""]);
  };

  return (
    <>
      <Navbar />
      <div className="xyz">
        <div className="container-center">
          <div className="card_center d-flex">
            <div className="card_create_project mb-4">
              <div className="card-body p-5 borders">
                <h2 className="card-title mb-4">Create a New Project</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label htmlFor="projectName" className="form-label">
                      Project Name
                    </label>
                    <input
                      type="text"
                      id="projectName"
                      value={projectName}
                      onChange={handleProjectNameChange}
                      className="form-control"
                      required
                    />
                    {errorData[0] && (
                      <p className="error-message">{errorData[0]}</p>
                    )}
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="projectDescription" className="form-label">
                      Description
                    </label>
                    <textarea
                      id="projectDescription"
                      value={projectDescription}
                      onChange={handleProjectDescriptionChange}
                      className="form-control"
                      rows="3"
                      required
                    />
                    {errorData.description && (
                      <p className="error-message">
                        {errorData.description.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">
                      Invite Members by Email
                    </label>
                    {inviteEmails.map((email, index) => (
                      <div key={index} className="input-group mb-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => handleEmailChange(index, e)}
                          className="form-control"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveEmailField(index)}
                          className="btn btn-outline-danger ml-1"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddEmailField}
                      className="btn btn-outline-secondary"
                    >
                      Add Another Email
                    </button>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Create Project
                  </button>
                </form>
                {message && <p className="mt-3 alert alert-info">{message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProject;
