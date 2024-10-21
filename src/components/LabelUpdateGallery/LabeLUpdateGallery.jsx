import React, { useState, useEffect, useCallback } from "react";
import LabelCanvas from "../LabelCanvas/LabelCanvas";
import "./LabelUpdateGallery.css";
import { useNavigate } from "react-router-dom";
import Loader from "../ui/Loader/Loader";
import { BaseURL } from "../../constant/BaseUrl";
import LabelUpdateCanvas from "../LabelUpdateCanvas/LabelUpdateCanvas";

const LabeLUpdateGallery = ({
  image,
  labelsList,
  labelColors,
  category,
  catId,
  id,
  projectId,
  selectedRectIndex,
  setSelectedRectIndex,
}) => {
  const [boxSelection, setBoxSelection] = useState(true);
  const [cursorStyle, setCursorStyle] = useState("default");
  const [showOpacity, setShowOpacity] = useState(null);
  const [currentImage, setCurrentImage] = useState(image);
  const [alreadyLabelImageID, setAlreadyLabelImageId] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [selectedLabel, setSelectedLabel] = useState();

  useEffect(() => {
    // Check for token and redirect to login if not found
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login page if no token is found
    }
  }, [navigate]);

  useEffect(() => {
    document.body.style.cursor = cursorStyle;
    setCursorStyle("default");
    return () => {
      document.body.style.cursor = "default";
    };
  }, [cursorStyle]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="gallery-container">
        <div className="image-container">
          {loading ? (
            <div className="loading-screen">Loading...</div>
          ) : currentImage ? (
            <>
              <LabelUpdateCanvas
                imageUrl={currentImage.firebase_url}
                boxSelection={boxSelection}
                projectId={projectId}
                showOpacity={showOpacity}
                setShowOpacity={setShowOpacity}
                imageid={currentImage.id}
                selectedLabel={selectedLabel}
                setSelectedLabel={setSelectedLabel}
                labelColors={labelColors}
                category={category}
                labelsList={labelsList}
                catId={catId}
                alreadyLabelImageID={alreadyLabelImageID}
                setAlreadyLabelImageId={setAlreadyLabelImageId}
                setSelectedRectIndex={setSelectedRectIndex}
                selectedRectIndex={selectedRectIndex}
              />
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default LabeLUpdateGallery;
