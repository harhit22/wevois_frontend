import React from "react";
import "./joinus.css";

const JoinUsSection = () => {
  return (
    <section className="join-us">
      <div className="join-us-content">
        <h2>Join over 500,000 developers building with Wevois</h2>
        <p>
          With a few images, you can deploy a computer vision model in an
          afternoon.
        </p>
        <button>Try Roboflow</button>
        <button>Talk to sales</button>
      </div>
      <div className="join-us-image">
        <img
          src="https://assets-global.website-files.com/60ff934f6ded2d17563ab9dd/64596bacc1fc19a9adcae092_blog%20header%201206%20x%20486%20(21).png"
          alt=""
          srcset=""
        />
      </div>
    </section>
  );
};

export default JoinUsSection;
