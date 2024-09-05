import React, { useState, useEffect, useCallback } from "react";
import Canvas from "../canvas/canvas";
import "./Gallery.css";

const Gallery = ({ projectId }) => {
  const [currentImage, setCurrentImage] = useState(null);
  const [labelData, setLabelData] = useState({});
  const [boxSelection, setBoxSelection] = useState(false);
  const [cursorStyle, setCursorStyle] = useState("default");
  const [showOpacity, setShowOpacity] = useState(null);
  const [previousImage, setPreviousImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/project/upload/api/${projectId}/next-image/`,
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
  }, [projectId]);

  const fetchPreviousImage = useCallback(async () => {
    try {
      let response;
      if (previousImage) {
        response = await fetch(
          `http://127.0.0.1:8000/project/upload/previous_image/${localStorage.getItem(
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
          `http://127.0.0.1:8000/project/upload/previous_image/${localStorage.getItem(
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
        `http://127.0.0.1:8000/project/upload/check_and_reassign_status/${currentImage.image_id}/`,
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
    return <div>Loading...</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="gallery-contain">
        {currentImage.image_id !== undefined && (
          <button
            id="previous"
            className="btn btn-primary gallery-nav-button gallery-prev-button"
            onClick={handlePrevious}
          >
            &lt;
          </button>
        )}
        {loading === false ? (
          <button
            id="next"
            className="btn btn-primary gallery-nav-button gallery-next-button"
            onClick={handleNext}
            disabled={isProcessing}
          >
            &gt;
          </button>
        ) : (
          ""
        )}
      </div>
      <div className="gallery-container">
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
            />
          ) : (
            <Canvas
              imageUrl={`${previousImage.image_file}`}
              labelData={labelData}
              onLabelChange={handleLabelChange}
              boxSelection={boxSelection}
              projectID={projectId}
              showOpacity={showOpacity}
              setShowOpacity={setShowOpacity}
              originalImageId={previousImage.original_image}
            />
          )}
        </div>
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
  );
};

export default Gallery;
