import React from "react";
import "./service.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";

const Service = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  console.log(isAuthenticated);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  return (
    <section className="service ">
      <div className="service-overlay container"></div>
      <div className="service-container">
        <div className="service-content">
          <h1>Empowering Sustainability and Data Excellence</h1>
          <p>
            Transforming waste management while pioneering data labeling
            solutions
          </p>
        </div>
        <div className="service-image">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6I8iB_Pmms4ef9j4nTulItdM0KxJo0kOFf_99jiBaZg&s"
            alt="Hero"
            width={"100%"}
          />
        </div>
      </div>
    </section>
  );
};

export default Service;
