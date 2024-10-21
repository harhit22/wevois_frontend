// ModelUpdateCanvas.js
import React, { useState, useEffect } from "react";
import "./ModelUpdateCanvas.css"; // Create styles for the modal
import { BaseURL } from "../../constant/BaseUrl";

const ModelUpdateCanvas = ({
  isOpen,
  onClose,
  projectId,
  catId,
  category,
  children,
}) => {
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
          `${BaseURL}categoryImage/next/${projectId}/${catId}/`,
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
    const fetchCategoriesData = async () => {
      try {
        const response = await fetch(
          `${BaseURL}project/${catId}/${category}/categories_data/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories data.");
        }
        const data = await response.json();
        setLabelsList(data.data);
        setLabelColors(data.colors);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCategoriesData();
  }, [catId, category]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <nav className="col-md-2 d-none d-md-block sidebar_background sidebar sidebar-category">
        <div className="sidebar-sticky">
          <h5 className="sidebar-heading ">Projects</h5>
          <ul className="nav flex-column">
            {labelList.map((label, index) => (
              <li
                key={index}
                className={`label-item ${
                  selectedLabel === label ? "selected" : ""
                }`}
                onClick={() => handleLabelClick(label)}
              >
                <p>
                  {
                    category === "Material"
                      ? label === "PET"
                        ? "E"
                        : label === "LDPE"
                        ? "L"
                        : label === "Raffia"
                        ? "F"
                        : label === "HDPE"
                        ? "H"
                        : label === "PVC"
                        ? "V"
                        : label === "PP"
                        ? "P"
                        : label === "MLP"
                        ? "M"
                        : label === "Thermacol"
                        ? "T"
                        : label === "Rubber"
                        ? "R"
                        : label === "Tyre"
                        ? "Y"
                        : label === "Paper"
                        ? "A"
                        : label === "Cardboard"
                        ? "C"
                        : label === "Metal"
                        ? "Q"
                        : label === "E-waste"
                        ? "W"
                        : label === "Glass"
                        ? "G"
                        : label === "Textile"
                        ? "X"
                        : label // Fallback to label if no match
                      : label[0] // Use first letter for other categories
                  }
                  : {label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModelUpdateCanvas;
