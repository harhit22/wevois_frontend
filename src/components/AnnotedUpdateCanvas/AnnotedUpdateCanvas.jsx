import React, { useEffect, useState } from "react";
import useImage from "../../helper/useImage";
import { Stage, Layer, Image, Rect, Text, Circle } from "react-konva";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CURSORSTYLES from "../../constant/cursorStyles";
import { BaseURL } from "../../constant/BaseUrl";

const AnnotedUpdateCanvas = ({
  imageUrl,
  labelData,
  onLabelChange,
  boxSelection,
  projectID,
  originalImageId,
  nextClick,
  onProcessingStart,
  onProcessingEnd,
  loadingImage,
}) => {
  const [image] = useImage(imageUrl);
  const [rectangles, setRectangles] = useState([]);
  const [newRect, setNewRect] = useState(null);
  const [selectedRect, setSelectedRect] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [resizingHandle, setResizingHandle] = useState(null);
  const [selectedRectIndex, setSelectedRectIndex] = useState(null);
  const [cursorStyle, setCursorStyle] = useState("default");
  const [getLabeledImage, setGetLabeledImage] = useState([]);
  const [isAnnotatedImage, setIsAnnotatedImage] = useState();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (nextClick) {
      setRectangles(labelData);
      document.body.style.cursor = cursorStyle;
      return () => {
        document.body.style.cursor = "default";
      };
    } else {
      if (labelData && labelData.length > 0) {
        setRectangles(labelData);
      }
      document.body.style.cursor = cursorStyle;
      return () => {
        document.body.style.cursor = "default";
      };
    }
  }, [cursorStyle, labelData, setRectangles]);

  // ---------------------------------------------------checking for already upadte a image--------------------------------

  useEffect(() => {
    fetchAlreadyLabelImage();
  }, [originalImageId]);

  const fetchAlreadyLabelImage = async () => {
    try {
      const response = await fetch(
        `${BaseURL}project/upload/api/check_already_annotated_image/${originalImageId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch the already annotated image.");
      }
      const data = await response.json();
      console.log(data, "cc");
      setIsAnnotatedImage((prevState) => {
        // Calculate the new state based on prevState
        return data;
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchDatasetFiles = async (projectId, callback) => {
    try {
      const response = await fetch(
        `${BaseURL}project/label_data/api/${projectId}/labeledImage/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch dataset files.");
      }
      const data = await response.json();

      setGetLabeledImage(data.files);

      if (callback) {
        callback();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRectSelect = (index) => {
    setSelectedRect(rectangles[index]);
    setSelectedRectIndex(index);
  };

  const isRectSelected = (index) => {
    return index === selectedRectIndex;
  };

  const handleMouseDown = (e) => {
    if (isSaving) return;
    if (
      e.target.attrs.id === "labelDropdown" ||
      e.target.attrs.id === "labelNameInput"
    ) {
      return; // Prevent interference with input fields
    }
    if (!boxSelection) {
      if (!image || newRect) return;
      const { x, y } = e.target.getStage().getPointerPosition();
      setNewRect({ x, y, width: 0, height: 0 });
      setCursorStyle("crosshair");
    } else {
      const { x, y } = e.target.getStage().getPointerPosition();
      const clickedRect = rectangles.find(
        (rect) =>
          ((x >= rect.x || x < rect.x) &&
            x <= rect.x + Math.abs(rect.width) &&
            y >= rect.y) ||
          (y < rect.y && y <= rect.y + Math.abs(rect.height))
      );
      console.log(clickedRect);
      if (clickedRect) {
        setSelectedRect(clickedRect);
        setDragging(true);
        setCursorStyle("move");
      }
    }
  };
  const handleMouseMove = (e) => {
    if (isSaving) return;
    if (newRect) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const newX = newRect.x;
      const newY = newRect.y;
      const newWidth = Math.min(x - newRect.x, image.width - newX);
      const newHeight = Math.min(y - newRect.y, image.height - newY);

      setNewRect({ x: newX, y: newY, width: newWidth, height: newHeight });
    } else if (dragging && selectedRect) {
      const { x, y } = e.target.getStage().getPointerPosition();
      setResizingHandle(false);
    }
  };

  const handleMouseUp = () => {
    if (isSaving) return;
    if (newRect) {
      const boundedRect = {
        ...newRect,
        width: Math.min(newRect.width, image.width - newRect.x),
        height: Math.min(newRect.height, image.height - newRect.y),
      };

      const updatedRectangles = [...rectangles, { ...boundedRect }];

      const filteredRectangles = updatedRectangles.filter(
        (rect) =>
          (rect.width >= 10 && rect.height >= 10) ||
          (rect.width <= -10 && rect.height <= -10) ||
          (rect.width >= 10 && rect.height <= -10) ||
          (rect.width <= -10 && rect.height >= 10)
      );

      setRectangles(filteredRectangles);
      onLabelChange(filteredRectangles);
      handleSave(filteredRectangles);
      setNewRect(null);
    } else if (dragging && !resizingHandle) {
      setDragging(false);
      setSelectedRect(null);
    }
  };

  const handleDeleteBox = () => {
    if (selectedRect) {
      const updatedRectangles = rectangles.filter(
        (rect) => rect !== selectedRect
      );
      setRectangles(updatedRectangles);
      onLabelChange(updatedRectangles);
      setSelectedRect(null);
      setSelectedRectIndex(null); // Reset selected rectangle index after deletion
    } else {
      console.log("No rectangle selected for deletion.");
    }
  };

  const handleResize = (e, rect, handlePosition) => {
    {
      const { x, y } = e.target.getStage().getPointerPosition();
      const dx = x - rect.x;
      const dy = y - rect.y;

      let newWidth, newHeight, newX, newY;

      switch (handlePosition) {
        case "bottomRight":
          setCursorStyle(CURSORSTYLES.bottomRightCorner);
          newWidth = dx;
          newHeight = dy;
          newX = rect.x;
          newY = rect.y;
          break;
        case "bottomLeft":
          setCursorStyle(CURSORSTYLES.bottomLeftCorner);
          newWidth = rect.width - dx;
          newHeight = dy;
          newX = x;
          newY = rect.y;
          break;
        case "topRight":
          setCursorStyle(CURSORSTYLES.topRightCorner);
          newWidth = dx;
          newHeight = rect.height - dy;
          newX = rect.x;
          newY = y;
          break;
        case "topLeft":
          setCursorStyle(CURSORSTYLES.topLeftCorner);
          newWidth = rect.width - dx;
          newHeight = rect.height - dy;
          newX = x;
          newY = y;
          break;
        default:
          return;
      }

      setRectangles((rects) =>
        rects.map((r) =>
          r === rect
            ? { ...r, x: newX, y: newY, width: newWidth, height: newHeight }
            : r
        )
      );

      onLabelChange(
        rectangles.map((r) =>
          r === rect
            ? { ...r, x: newX, y: newY, width: newWidth, height: newHeight }
            : r
        )
      );
    }
    setResizingHandle(true);
  };

  const handleCircleDragEnd = (rect) => {
    const updatedRectangles = rectangles.map((r) =>
      r === rect
        ? { ...r, x: rect.x, y: rect.y, width: rect.width, height: rect.height }
        : r
    );

    setRectangles(updatedRectangles);
    onLabelChange(updatedRectangles);
    handleSave(updatedRectangles);
    setCursorStyle("grab");
  };

  // ----------------------------------saving data ----------------------------------------
  const handleSave = async (filteredRectangles) => {
    const toastId = toast.loading("Processing...");
    try {
      setIsSaving(true);
      // Wait for the dataset files to be fetched
      onProcessingStart();
      await fetchDatasetFiles(projectID);

      const imageData = new FormData();
      imageData.append("project", projectID);
      imageData.append("original_image", originalImageId);
      imageData.append("uploaded_by", localStorage.getItem("user_id"));
      const token = localStorage.getItem("token");
      const modifiedImageUrl = imageUrl.replace("/static", "");

      const response = await fetch(modifiedImageUrl);
      const imageName = imageUrl.split("/").pop();
      if (!response.ok) {
        throw new Error("Failed to fetch image file");
      }
      const blob = await response.blob();
      imageData.append("image_file", imageName);

      let image_id = null;

      if (!isAnnotatedImage && filteredRectangles.length !== 0) {
        // Save the image
        const imageResponse = await fetch(
          `${BaseURL}project/label_data/save_labeled_image/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: imageData,
          }
        );

        if (!imageResponse.ok) {
          const errorMessage = await imageResponse.text();
          throw new Error(`Failed to save image: ${errorMessage}`);
        }
        const imageResult = await imageResponse.json();
        image_id = imageResult.id;

        // Save labels for the image
        for (const rect of filteredRectangles) {
          const labelResponse = await fetch(
            `${BaseURL}project/label_data/save_label_for_image/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                image: image_id,
                label: rect.label,
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
              }),
            }
          );

          if (!labelResponse.ok) {
            const labelErrorMessage = await labelResponse.text();
            throw new Error(
              `Failed to save label "${rect.label}": ${labelErrorMessage}`
            );
          }
        }
      } else {
        if (isAnnotatedImage) {
          const deleteResponse = await fetch(
            `${BaseURL}project/label_data/delete_existing_labels/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ image_id: isAnnotatedImage }),
            }
          );

          if (!deleteResponse.ok) {
            const errorMessage = await deleteResponse.text();
            throw new Error(`Failed to delete labels: ${errorMessage}`);
          }
        }

        // Save new labels for the image
        for (const rect of filteredRectangles) {
          const labelResponse = await fetch(
            `${BaseURL}project/label_data/save_label_for_image/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                image: isAnnotatedImage,
                label: rect.label,
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
              }),
            }
          );

          if (!labelResponse.ok) {
            const labelErrorMessage = await labelResponse.text();
            throw new Error(
              `Failed to save label "${rect.label}": ${labelErrorMessage}`
            );
          }
        }
      }

      // Update image status
      const updateStatusResponse = await fetch(
        `${BaseURL}project/upload/update_image_status/${originalImageId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "completed" }),
        }
      );

      toast.update(toastId, {
        render: "Processing completed",
        type: "success",
        isLoading: false,
        autoClose: 1000,
      });
    } catch (error) {
      console.error("Error saving labels:", error);
      toast.update(toastId, {
        render: "Failed to save labels",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
    onProcessingEnd();
    setIsSaving(false);
    fetchAlreadyLabelImage();
  };

  return (
    <>
      <div>
        <div>
          {loadingImage && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "black",
                fontSize: "20px",
              }}
            >
              Loading image...
            </div>
          )}
          <Stage
            width={Math.min(window.innerWidth, 1000)}
            height={Math.min(window.innerHeight - 30, 800)}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onContextMenu={(e) => {
              e.evt.preventDefault();
              handleDeleteBox();
            }}
          >
            <Layer>
              <Image image={image} stroke="black" strokeWidth={4} />
              {rectangles.map((rect, i) => (
                <React.Fragment key={i}>
                  <Text name={rect.name} />
                  <Rect
                    fill="red"
                    x={rect.x}
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    stroke={"black" || "red"}
                    strokeWidth={2} // Adjust the thickness as needed
                    draggable={isRectSelected(i) && boxSelection}
                    opacity={isRectSelected(i) ? 0.2 : 0.1}
                    onClick={() => handleRectSelect(i)}
                    onDragMove={(e) => handleMouseMove(e, rect)}
                    onDragEnd={(e) => {
                      setDragging(false);
                      const { x, y } = e.target.getPosition();
                      const updatedRectangles = rectangles.map((r) =>
                        r === rect ? { ...r, x, y } : r
                      );
                      setRectangles(updatedRectangles);
                      onLabelChange(updatedRectangles);
                      handleSave(updatedRectangles);
                    }}
                  />

                  {boxSelection && (
                    <>
                      <Circle
                        x={rect.x + rect.width}
                        y={rect.y + rect.height}
                        radius={5}
                        fill="#ffffff"
                        stroke="#000000"
                        strokeWidth={2}
                        draggable
                        onMouseEnter={() => {
                          setResizingHandle("bottomRight");
                          setCursorStyle(CURSORSTYLES.bottomRightCorner);
                        }}
                        onMouseLeave={() => {
                          setCursorStyle(CURSORSTYLES.move);
                        }}
                        onDragMove={(e) => handleResize(e, rect, "bottomRight")}
                        onDragEnd={() => handleCircleDragEnd(rect)}
                      />
                      <Circle
                        x={rect.x}
                        y={rect.y + rect.height}
                        radius={5}
                        fill="#ffffff"
                        stroke="#000000"
                        strokeWidth={2}
                        draggable
                        onMouseEnter={() => {
                          setResizingHandle("bottomLeft");
                          setCursorStyle(CURSORSTYLES.bottomLeftCorner);
                        }}
                        onMouseLeave={() => {
                          setCursorStyle(CURSORSTYLES.move);
                        }}
                        onDragMove={(e) => handleResize(e, rect, "bottomLeft")}
                        onDragEnd={() => handleCircleDragEnd(rect)}
                      />
                      <Circle
                        x={rect.x + rect.width}
                        y={rect.y}
                        radius={5}
                        fill="#ffffff"
                        stroke="#000000"
                        strokeWidth={2}
                        draggable
                        onMouseEnter={() => {
                          setResizingHandle("topRight");
                          setCursorStyle(CURSORSTYLES.topRightCorner);
                        }}
                        onMouseLeave={() => {
                          setCursorStyle(CURSORSTYLES.move);
                        }}
                        onDragMove={(e) => handleResize(e, rect, "topRight")}
                        onDragEnd={() => handleCircleDragEnd(rect)}
                      />
                      <Circle
                        x={rect.x}
                        y={rect.y}
                        radius={5}
                        fill="#ffffff"
                        stroke="#000000"
                        strokeWidth={2}
                        draggable
                        onMouseEnter={() => {
                          setResizingHandle("topLeft");
                          setCursorStyle(CURSORSTYLES.topLeftCorner);
                        }}
                        onMouseLeave={() => {
                          setCursorStyle(CURSORSTYLES.move);
                        }}
                        onDragMove={(e) => handleResize(e, rect, "topLeft")}
                        onDragEnd={() => handleCircleDragEnd(rect)}
                      />
                    </>
                  )}
                </React.Fragment>
              ))}

              {newRect && (
                <Rect
                  x={newRect.x}
                  y={newRect.y}
                  width={newRect.width}
                  height={newRect.height}
                  stroke={"blue"}
                />
              )}
            </Layer>
          </Stage>
        </div>

        <ToastContainer />
      </div>
    </>
  );
};

export default AnnotedUpdateCanvas;
