import React, { useState } from "react";
import Navbar from "../../components/basic/navbar/navbar";
import "./Login.css";
import { NavLink, useNavigate } from "react-router-dom";
import { handleChange, handleSubmit } from "../../utils/authutils";

const Loginpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleChangeWrapper = (e) => handleChange(e, setEmail, setPassword);
  const handleSubmitWrapper = (e) =>
    handleSubmit(e, email, password, navigate, setEmail, setPassword);

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <>
      <div className="xyz">
        <Navbar />
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmitWrapper}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChangeWrapper}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChangeWrapper}
                required
              />
            </div>
            <button type="submit">Login</button>
            <div className="forgot-password p-2">
              <NavLink to="/forgot-password" className="forget-password">
                Forgot Password?
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Loginpage;
