import React, { useState, useEffect, useCallback } from "react";
import LabelCanvas from "../LabelCanvas/LabelCanvas";
import "./LabelGallery.css";
import { useNavigate } from "react-router-dom";
import Loader from "../ui/Loader/Loader";
import { BaseURL } from "../../constant/BaseUrl";

const LabelGallery = ({
  images,

  labelsList,
  labelColors,
  selectedLabel,
  setSelectedLabel,
  category,
  catId,
  id,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [labelData, setLabelData] = useState({});
  const [boxSelection, setBoxSelection] = useState(true);
  const [cursorStyle, setCursorStyle] = useState("default");
  const [showOpacity, setShowOpacity] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [alreadyLabelImageID, setAlreadyLabelImageId] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedRectIndex, setSelectedRectIndex] = useState(null);

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

  const fetchNextImage = useCallback(async () => {
    setSelectedRectIndex(0);
    setLoading(true);
    try {
      const response = await fetch(
        `${BaseURL}categoryImage/next/${id}/${catId}/`,
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
      setCurrentImage(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, [id, catId]);

  useEffect(() => {
    fetchNextImage();
  }, [id, catId, fetchNextImage]);

  const handleNext = useCallback(async () => {
    setAlreadyLabelImageId("none");
    try {
      await fetchNextImage();

      const response = await fetch(
        `${BaseURL}categoryImage/check_and_reassgin_cat_image/${currentImage.image["id"]}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check and reassign status.");
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }

    setLabelData({});
    setBoxSelection(false);
  }, [fetchNextImage, currentImage]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setBoxSelection(false);
  }, [images.length]);

  const handleLabelChange = (rectangles) => {
    setLabelData((prevLabelData) => ({
      ...prevLabelData,
      [currentIndex]: rectangles,
    }));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePrevious, handleNext]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="gallery-contain">
        <div className="nav_btnn">
          <span
            to="#"
            id="previous"
            onClick={handlePrevious}
            className="gallery-nav-button gallery-prev-button"
            disabled={loading}
          >
            <i class="fa fa-chevron-left"></i>
          </span>
          <span
            to="#"
            id="next"
            onClick={handleNext}
            className="gallery-nav-button gallery-prev-button"
            disabled={loading}
          >
            <i class="fa fa-chevron-right"></i>
          </span>
        </div>
      </div>

      <div className="gallery-container">
        <div className="image-container">
          {loading ? (
            <div className="loading-screen">Loading...</div>
          ) : currentImage ? (
            <>
              <LabelCanvas
                imageUrl={currentImage.image.firebase_url}
                labelData={labelData[currentIndex] || []}
                onLabelChange={handleLabelChange}
                boxSelection={boxSelection}
                projectId={id}
                showOpacity={showOpacity}
                setShowOpacity={setShowOpacity}
                imageid={currentImage.image.id}
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

export default LabelGallery;
