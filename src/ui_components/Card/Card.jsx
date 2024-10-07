import React from "react";
import { NavLink } from "react-router-dom";

const Card = ({ title, description, link, linkText }) => {
  return (
    <div className="col-lg-4 col-md-6 mb-4 mt-2">
      <div className="card h-100">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <hr />
          <p className="card-text">{description}</p>
          <NavLink className="btn btn-primary" to={link}>
            {linkText}
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Card;
