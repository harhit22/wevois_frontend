import React, { useState } from "react";
import "./Register.css";
import Navbar from "../../components/basic/navbar/navbar";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password1":
        setPassword1(value);
        break;
      case "password2":
        setPassword2(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { username, email, password1, password2 };
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/account/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Registration successful, navigate to login
        navigate("/login");
      } else {
        console.log("Error response data:", data); // Add this to inspect the error structure
        setErrors(data); // Set errors from server response
      }
    } catch (error) {
      console.error("Registration error:", error);
    }

    // Reset form fields after submission
    setUsername("");
    setEmail("");
    setPassword1("");
    setPassword2("");
  };

  return (
    <>
      <Navbar />
      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={handleChange}
              required
            />
            {errors.username && <p className="error">{errors.username[0]}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
            {errors[0] && <p className="error">{errors[0]}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="password1">Password</label>
            <input
              type="password"
              id="password1"
              name="password1"
              value={password1}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password2">Confirm Password</label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={password2}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
};

export default RegisterPage;
