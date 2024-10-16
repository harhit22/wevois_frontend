import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="ring"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};

export default Loader;
