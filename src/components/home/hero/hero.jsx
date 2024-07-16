import React from "react";
import "./hero.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    console.log(token);
  }, []);
  return (
    <section className="hero ">
      <div className="hero-container">
        <div className="hero-content">
          <h1>Welcome to Our Site</h1>
          <p>
            Join us in the fight against waste, where professionalism meets
            environmental stewardship. Explore how we're revolutionizing waste
            management practices and pioneering sustainable solutions.
          </p>
        </div>
        <div className="hero-image">
          <img
            src="https://repository-images.githubusercontent.com/192640529/970b6900-817b-11eb-9f57-adf3f87c6ff9"
            alt="Hero"
          />
          <div className="hero-buttons">
            {isAuthenticated ? (
              <a href="/projectList" className="btn btn-primary">
                Start Labeling
              </a>
            ) : (
              <>
                <a href="/register" className="btn btn-primary">
                  Register
                </a>
                <a href="/login" className="btn btn-primary">
                  Login
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
