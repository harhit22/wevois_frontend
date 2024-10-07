import React, { useState, useEffect, useCallback } from "react";
import Canvas from "../canvas/canvas";
import "./AnnotedUpdateGallery.css";
import Loader from "../ui/Loader/Loader";
import AnnotedUpdateCanvas from "../AnnotedUpdateCanvas/AnnotedUpdateCanvas";

const AnnotedUpdateGallery = ({ projectId, initialImage, initallabelData }) => {
  const [currentImage, setCurrentImage] = useState(initialImage);
  const [labelData, setLabelData] = useState(initallabelData);
  const [boxSelection, setBoxSelection] = useState(false);
  const [cursorStyle, setCursorStyle] = useState("default");
  const [showOpacity, setShowOpacity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);
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

  const handleBoxSelection = () => {
    setBoxSelection(true);
    setCursorStyle("grab");
  };

  const handledrawSelection = () => {
    setBoxSelection(false);
    setShowOpacity(null);
    setCursorStyle("crosshair");
  };

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
      <div className="gallery-container">
        <div className="image-container">
          <AnnotedUpdateCanvas
            imageUrl={`${currentImage.firebase_url}`}
            labelData={labelData}
            onLabelChange={handleLabelChange}
            boxSelection={boxSelection}
            projectID={projectId}
            showOpacity={showOpacity}
            setShowOpacity={setShowOpacity}
            loadingImage={loadingImage}
            onProcessingStart={handleProcessingStart}
            onProcessingEnd={handleProcessingEnd}
            originalImageId={currentImage.id}
          />
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

export default AnnotedUpdateGallery;
