import React from "react";
import "./navbar.css";
import URLs from "../../../constant/url";
import { NavLink } from "react-router-dom";

import "bootstrap-icons/font/bootstrap-icons.css";

const Navbar = () => {
  const logout = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${URLs.ACCOUNT_URL}api/logout/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Clear localStorage
      localStorage.removeItem("token");
      window.location.reload();
    } else {
      // Handle logout failure
      localStorage.removeItem("token");
      window.location.reload();
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark pb-1 pt-1">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/"></NavLink>
          <NavLink className="navbar-brand-text" to="/">
            Wevois
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-md-auto gap-2">
              <li className="nav-item rounded">
                <button
                  className="nav-link logout "
                  onClick={logout}
                  type="button"
                >
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
