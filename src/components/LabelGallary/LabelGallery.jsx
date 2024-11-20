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
  const [labelData, setLabelData] = useState([]);
  const [boxSelection, setBoxSelection] = useState(true);
  const [cursorStyle, setCursorStyle] = useState("default");
  const [showOpacity, setShowOpacity] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [alreadyLabelImageID, setAlreadyLabelImageId] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedRectIndex, setSelectedRectIndex] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [disabled, setDisable] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
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
    setLoading(true);
    setDisable(true);
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
      setCurrentImage(data); // Make sure to update current image
      setLabelData([]); // Reset labelData when fetching a new image
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
    setPreviousImage();
    setAlreadyLabelImageId("none");
    setLabelData({});
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

  const fetchPreviousImage = useCallback(async () => {
    setDisable(false);
    try {
      let response;
      const userId = localStorage.getItem("user_id");
      const token = localStorage.getItem("token");

      if (previousImage) {
        response = await fetch(
          `${BaseURL}categoryImage/previous_image/${userId}/${previousImage.id}/${category}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await fetch(
          `${BaseURL}categoryImage/previous_image/${userId}/${category}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (!response.ok) {
        throw new Error("Failed to fetch the previous image.");
      }

      const data = await response.json();
      console.log(data, "previous image data");
      // Set previousImage based on fetched data
      setPreviousImage(data.image);
      setLabelData(data.labels);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [previousImage, category]);

  const handlePrevious = useCallback(() => {
    setLoading(true);
    fetchPreviousImage();
    setLoading(false);
  }, [fetchPreviousImage]);

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
        console.log(disabled);
        if (!disabled) {
          handleNext();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePrevious, handleNext, disabled]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="gallery-contain">
        <div className="nav_btnn">
          <button
            to="#"
            id="previous"
            onClick={handlePrevious}
            className="gallery-nav-button gallery-prev-button"
          >
            <i className="fa fa-chevron-left"></i>
          </button>
          <button
            to="#"
            id="next"
            onClick={handleNext}
            className="gallery-nav-button gallery-next-button"
            disabled={loading || disabled}
          >
            <i className="fa fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div className="gallery-container">
        <div className="image-container">
          {loading ? (
            <div className="loading-screen">Loading...</div>
          ) : currentImage ? (
            <>
              {previousImage ? (
                <LabelCanvas
                  imageUrl={previousImage.firebase_url} // Ensure this matches your API response
                  labelData={labelData}
                  onLabelChange={handleLabelChange}
                  boxSelection={boxSelection}
                  projectId={id}
                  imageid={previousImage.id} // Ensure this is the ID of the previous image
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
                  setDisable={setDisable}
                />
              ) : (
                <LabelCanvas
                  imageUrl={currentImage.image.firebase_url}
                  labelData={[]}
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
                  setDisable={setDisable}
                />
              )}
            </>
          ) : (
            <p style={{ color: "#fff" }}>No image available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default LabelGallery;
