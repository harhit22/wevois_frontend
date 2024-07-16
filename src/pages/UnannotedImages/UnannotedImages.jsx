import React, { useState, useEffect } from "react";
import Navbar from "../../components/basic/navbar/navbar";
import { useParams } from "react-router-dom";
import Gallery from "../../components/Gallery/Gallery";

const UnannotedImages = () => {
  const { projectId } = useParams();

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row dash_back">
          <nav className="col-md-2 d-none d-md-block sidebar_background sidebar sidebar-category">
            <div className="sidebar-sticky">
              <h5 className="sidebar-heading ">Projects</h5>
              <ul className="nav flex-column">
                <li>
                  <img
                    src="https://t3.ftcdn.net/jpg/05/90/82/32/360_F_590823233_97YNah2bYsEW9llwf7UNK5L3r1cM0Ei3.jpg"
                    alt=""
                    width="80%"
                    style={{ paddingLeft: "30px" }}
                  />
                </li>
                <br />
                <hr />
              </ul>
            </div>
          </nav>
          <main className="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div className="dataset-list-container">
              <Gallery projectId={projectId} />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default UnannotedImages;
