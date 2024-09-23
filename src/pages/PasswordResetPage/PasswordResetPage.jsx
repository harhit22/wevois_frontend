import React, { useState } from "react";
import { useParams } from "react-router-dom";

const PasswordResetPage = () => {
  const { uidb64, token } = useParams(); // Get uidb64 and token from the URL
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/account/password-reset-confirm/${uidb64}/${token}/`,
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
      alert(data.detail); // Notify the user of the result
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