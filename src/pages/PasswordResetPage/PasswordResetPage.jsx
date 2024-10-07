import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./PasswordResetPage.css";
import { BaseURL } from "../../constant/BaseUrl";

const PasswordResetPage = () => {
  const { uidb64, token } = useParams(); // Get uidb64 and token from the URL
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      const response = await fetch(
        `${BaseURL}account/password-reset-confirm/${uidb64}/${token}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ new_password: password }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reset password.");
      }

      const data = await response.json();
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while resetting the password.");
    }
  };

  return (
    <div className="password-reset-container">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="new-password">New Password</label>
          <input
            type="password"
            id="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default PasswordResetPage;
