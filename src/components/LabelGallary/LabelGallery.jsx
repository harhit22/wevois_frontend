import React, { useState, useEffect, useCallback } from "react";
import LabelCanvas from "../LabelCanvas/LabelCanvas";
import "./LabelGallery.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    document.body.style.cursor = cursorStyle;
    setCursorStyle("default");
    return () => {
      document.body.style.cursor = "default";
    };
  }, [cursorStyle]);

  const fetchNextImage = useCallback(async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/categoryImage/next/${id}/${catId}/`,
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
      setCurrentImage(data);
    } catch (error) {
      console.error("Error:", error);
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
        `http://127.0.0.1:8000/categoryImage/check_and_reassgin_cat_image/${currentImage.image["id"]}/`,
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

  return (
    <>
      <div className="gallery-contain">
        <Link
          to="#"
          id="previous"
          onClick={handlePrevious}
          className="my_button"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        <Link to="#" id="next" onClick={handleNext} className="my_button">
          <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </div>

      <div className="gallery-container">
        <div className="image-container">
          {currentImage ? (
            <>
              <LabelCanvas
                imageUrl={
                  "http://127.0.0.1:8000" + currentImage.image.image_file
                }
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
