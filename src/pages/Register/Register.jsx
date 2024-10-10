import React, { useState, useEffect } from "react";
import "./Register.css";
import Navbar from "../../components/basic/navbar/navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BaseURL } from "../../constant/BaseUrl";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("message") === "register") {
      toast.info("Please register first to accept the invitation.");
    }
  }, [location]);

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
        checkPasswordsMatch(value, password2);
        break;
      case "password2":
        setPassword2(value);
        checkPasswordsMatch(password1, value);
        break;
      default:
        break;
    }
  };

  const checkPasswordsMatch = (pwd1, pwd2) => {
    setPasswordsMatch(pwd1 === pwd2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { username, email, password1, password2 };
    try {
      const response = await fetch(`${BaseURL}account/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login");
      } else {
        console.log("Error response data:", data);
        setErrors(data);
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
      <div className="xyz">
        <Navbar />
        <ToastContainer />
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
                style={{
                  borderColor: !passwordsMatch && password2 ? "red" : "",
                }}
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
                style={{
                  borderColor: !passwordsMatch && password1 ? "red" : "",
                }}
              />
              {!passwordsMatch && (
                <p className="error">Passwords do not match</p>
              )}
            </div>
            <button
              type="submit"
              disabled={!passwordsMatch}
              style={{
                backgroundColor: !passwordsMatch ? "#5DB8D2" : "",
                cursor: !passwordsMatch ? "not-allowed" : "pointer",
              }}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
