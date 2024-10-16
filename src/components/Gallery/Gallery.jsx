import React, { useState, useEffect, useCallback } from "react";
import Canvas from "../canvas/canvas";
import { BaseURL } from "../../constant/BaseUrl";
import "./Gallery.css";
import Loader from "../ui/Loader/Loader";

const Gallery = ({ projectId, initialImage }) => {
  const [currentImage, setCurrentImage] = useState(initialImage);
  const [labelData, setLabelData] = useState({});
  const [boxSelection, setBoxSelection] = useState(false);
  const [cursorStyle, setCursorStyle] = useState("default");
  const [showOpacity, setShowOpacity] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);
  const [disabled, setDisable] = useState(true);
  const handleProcessingStart = () => {
    setIsProcessing(true);
  };

  const handleProcessingEnd = () => {
    setIsProcessing(false);
  };

  useEffect(() => {
    document.body.style.cursor = cursorStyle;
    return () => {
      document.body.style.cursor = "default";
    };
  }, [cursorStyle]);

  const fetchNextImage = useCallback(async () => {
    setDisable(true);
    setLoadingImage(true);
    try {
      const response = await fetch(
        `${BaseURL}project/upload/api/${projectId}/next-image/`,
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
    } finally {
      setLoadingImage(false);
    }
  }, [projectId]);

  const fetchPreviousImage = useCallback(async () => {
    try {
      let response;
      if (previousImage) {
        response = await fetch(
          `${BaseURL}project/upload/previous_image/${localStorage.getItem(
            "user_id"
          )}/${previousImage.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        response = await fetch(
          `${BaseURL}project/upload/previous_image/${localStorage.getItem(
            "user_id"
          )}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      if (!response.ok) {
        throw new Error("Failed to fetch the previous image.");
      }

      const data = await response.json();
      setPreviousImage(data.image);
      setLabelData(data.labels);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [previousImage, setPreviousImage, setLabelData]);

  useEffect(() => {
    fetchNextImage();
  }, [projectId, fetchNextImage]);

  const handleBoxSelection = () => {
    setBoxSelection(true);
    setCursorStyle("grab");
  };

  const handledrawSelection = () => {
    setBoxSelection(false);
    setShowOpacity(null);
    setCursorStyle("crosshair");
  };

  const handlePolygonSelection = () => {
    setBoxSelection(false);
    setShowOpacity(null);
    setCursorStyle("crosshair");
  };

  const handleNext = useCallback(async () => {
    setLoading(true);
    setPreviousImage(null);
    try {
      await fetchNextImage();

      const response = await fetch(
        `${BaseURL}project/upload/check_and_reassign_status/${currentImage.image_id}/`,
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
    setLoading(false);
  }, [fetchNextImage, currentImage]);

  const handlePrevious = useCallback(() => {
    fetchPreviousImage();
  }, [fetchPreviousImage]);

  const handleLabelChange = (rectangles) => {
    setLabelData((prevLabelData) => ({
      ...prevLabelData,
      [currentImage?.id]: rectangles,
    }));
  };

  if (!currentImage) {
    return <Loader />;
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="gallery-contain">
        <div className="nav_btnn">
          {currentImage.image_id !== undefined && (
            <span
              id="previous"
              className="gallery-nav-button gallery-prev-button"
              onClick={handlePrevious}
            >
              <i class="fa fa-chevron-left"></i>
            </span>
          )}
          {loading === false ? (
            <span
              id="next"
              className={`gallery-nav-button gallery-next-button ${
                disabled ? "disabled" : ""
              }`}
              onClick={!disabled || isProcessing ? handleNext : null}
            >
              <i className="fa fa-chevron-right"></i>
            </span>
          ) : (
            ""
          )}
        </div>
      </div>
      <>
        <div className="image-container">
          {!previousImage ? (
            <Canvas
              imageUrl={`${currentImage.image_path}`}
              labelData={labelData[currentImage.id] || []}
              onLabelChange={handleLabelChange}
              boxSelection={boxSelection}
              projectID={projectId}
              showOpacity={showOpacity}
              setShowOpacity={setShowOpacity}
              originalImageId={currentImage.image_id}
              image_name={currentImage.filename}
              image_path={currentImage.image_path}
              nextClick={"nextClick"}
              onProcessingStart={handleProcessingStart}
              onProcessingEnd={handleProcessingEnd}
              loadingImage={loadingImage}
              setDisable={setDisable}
            />
          ) : (
            <Canvas
              imageUrl={`${previousImage.firebase_url}`}
              labelData={labelData}
              onLabelChange={handleLabelChange}
              boxSelection={boxSelection}
              projectID={projectId}
              showOpacity={showOpacity}
              setShowOpacity={setShowOpacity}
              originalImageId={previousImage.original_image}
              loadingImage={loadingImage}
              onProcessingStart={handleProcessingStart}
              onProcessingEnd={handleProcessingEnd}
              setDisable={setDisable}
            />
          )}
          <div className="sidebar-controls">
            <button
              onClick={handleBoxSelection}
              className={`my_button btn ${
                boxSelection ? "green-background-select" : ""
              }`}
            >
              ✋
            </button>
            <button
              onClick={handledrawSelection}
              className={`my_button btn ${
                !boxSelection ? "green-background-draw" : ""
              }`}
            >
              🧹
            </button>
          </div>
        </div>
      </>
    </>
  );
};

export default Gallery;
