import React, { useState } from "react";
import "./forgetPassword.css";
import Navbar from "../../components/basic/navbar/navbar";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/account/send-reset-email/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        alert("Password reset email sent. Please check your inbox.");
      } else {
        alert("Failed to send reset email.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while sending the email.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="xyz">
        <div className="forgot-password-container">
          <h2>Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit">Send Reset Link</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
