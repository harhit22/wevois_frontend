import React, { useState, useEffect } from "react";
import Navbar from "../../components/basic/navbar/navbar";
import { useParams } from "react-router-dom";
import LabelGallery from "../../components/LabelGallary/LabelGallery";
import "./LabelCategory.css";

const LabelCategory = () => {
  const { projectId, catId, category } = useParams();
  const [datasetFiles, setDatasetFiles] = useState([]);
  const [labelList, setLabelsList] = useState([]);
  const [labelColors, setLabelColors] = useState({});
  const [selectedLabel, setSelectedLabel] = useState(null);

  const handleLabelClick = (label) => {
    setSelectedLabel(label);
  };

  useEffect(() => {
    const fetchNextImage = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/categoryImage/next/${projectId}/${catId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch the next image.");
        }
        const data = await response.json();
        console.log(data);
        setDatasetFiles(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchNextImage();
  }, [projectId, catId]);

  useEffect(() => {
    const categories_data = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/project/${catId}/${category}/categories_data/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch projects.");
        }
        const data = await response.json();
        setLabelsList(data.data);
        setLabelColors(data.colors);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    categories_data();
  }, [catId, category]);

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
                {labelList.map((label, index) => (
                  <li
                    key={index}
                    className={`label-item ${
                      selectedLabel === label ? "selected" : ""
                    }`}
                    onClick={() => handleLabelClick(label)}
                  >
                    <p>
                      {label[0]}: {label}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          <main className="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div className="dataset-list-container">
              {datasetFiles ? (
                <LabelGallery
                  images={datasetFiles}
                  id={projectId}
                  labelsList={labelList}
                  labelColors={labelColors}
                  catId={catId}
                  category={category}
                  selectedLabel={selectedLabel}
                  setSelectedLabel={setSelectedLabel}
                />
              ) : (
                <p>No files in the dataset.</p>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default LabelCategory;
