import React, { useState } from "react";
import URLs from "../../constant/url";
import "./CreateProject.css";
import Navbar from "../../components/basic/navbar/navbar";

const CreateProject = ({ onProjectCreated }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [inviteEmails, setInviteEmails] = useState([""]);
  const [message, setMessage] = useState("");

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
        throw new Error("Failed to create project.");
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
        onProjectCreated(data); // Callback to update the project list in parent component
      } else {
        setMessage("Failed to send invitations.");
      }
    } catch (error) {
      setMessage("An error occurred.");
      console.error("Error:", error);
    }

    setProjectName("");
    setProjectDescription("");
    setInviteEmails([""]);
  };

  return (
    <>
      <Navbar />
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
                </div>
                <div className="form-group mb-3">
                  <label className="form-label">Invite Members by Email</label>
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
                        className="btn btn-outline-danger"
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
    </>
  );
};

export default CreateProject;
