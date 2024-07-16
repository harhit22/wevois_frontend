import React, { useEffect, useState } from "react";
import useImage from "../../helper/useImage";
import { Stage, Layer, Image as KonvaImage, Rect, Text } from "react-konva";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { purple } from "@mui/material/colors";

const LabelCanvas = ({
  imageUrl,
  labelData,
  imageid,
  selectedLabel,
  labelColors,
  setSelectedLabel,
  category,
  labelsList,
  catId,
  projectId,
  setAlreadyLabelImageId,
  alreadyLabelImageID,
}) => {
  const [image] = useImage(imageUrl);
  const [rectangles, setRectangles] = useState([]);
  const [selectedRectIndex, setSelectedRectIndex] = useState(null);
  // eslint-disable-next-line
  const [cursorStyle, setCursorStyle] = useState("default");

  console.log(imageid);

  useEffect(() => {
    // eslint-disable-next-line
    setRectangles(labelData);
    document.body.style.cursor = cursorStyle;
    if (rectangles.length === 1) {
      handleRectSelect(0);
    }
    return () => {
      document.body.style.cursor = "default";
    };
    // eslint-disable-next-line
  }, [cursorStyle]);

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/categoryImage/Labels/labels/${imageid}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRectangles((prevRectangles) => {
          const newRects = data.filter(
            (newRect) =>
              !prevRectangles.some(
                (rect) =>
                  rect.x === newRect.x &&
                  rect.y === newRect.y &&
                  rect.width === newRect.width &&
                  rect.height === newRect.height
              )
          );
          return [...newRects];
        });
      } catch (error) {
        console.error("There was an error fetching the labels!", error);
      }
    };

    fetchLabels();
  }, [imageid]);

  useEffect(() => {
    const get_label_image_id = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/categoryImage/get_label_image/${imageid}/${catId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch the label image.");
        }
        const data = await response.json();
        console.log(data);
        setAlreadyLabelImageId(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    get_label_image_id();
  }, []);

  const get_label_image_id = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/categoryImage/get_label_image/${imageid}/${catId}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch the label image.");
      }
      const data = await response.json();
      setAlreadyLabelImageId(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRectSelect = (index) => {
    setSelectedRectIndex(index);
    const updatedRectangles = rectangles.map((rect, i) => {
      if (i === index) {
        return {
          ...rect,
          color: labelColors[selectedLabel],
          name: selectedLabel,
        };
      }
      return rect;
    });

    setRectangles(updatedRectangles);
  };

  const isRectSelected = (index) => {
    return index === selectedRectIndex;
  };

  const handleMouseDown = (e) => {
    const { x, y } = e.target.getStage().getPointerPosition();
    const clickedRectIndex = rectangles.findIndex(
      (rect) =>
        x >= rect.x &&
        x <= rect.x + rect.width &&
        y >= rect.y &&
        y <= rect.y + rect.height
    );
    if (clickedRectIndex !== -1) {
      handleRectSelect(clickedRectIndex);
    }
  };

  const handleSave = async (rectangles, catId, imageUrl) => {
    const toastId = toast.loading("Processing...");
    console.log(imageid, "this is image id");

    try {
      const imageData = new FormData();
      imageData.append("category", catId);
      const response = await fetch(imageUrl);
      const imageName = imageUrl.split("/").pop();
      if (!response.ok) {
        throw new Error("Failed to fetch image file");
      }

      const blob = await response.blob();
      const file = new File([blob], imageName, { type: blob.type });
      imageData.append("image", imageid);
      imageData.append("project", projectId);
      imageData.append("image_file", file);

      const img = new window.Image();
      img.src = URL.createObjectURL(blob);
      img.onload = async () => {
        const imageWidth = img.width;
        const imageHeight = img.height;

        imageData.append("image_width", imageWidth);
        imageData.append("image_height", imageHeight);

        const token = localStorage.getItem("token");
        const imageResponse = await fetch(
          "http://127.0.0.1:8000/categoryImageSave/save_category_labeled_image/",
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
        const image_id = imageResult.id;

        for (const rect of rectangles) {
          const labelResponse = await fetch(
            "http://127.0.0.1:8000/categoryImageSave/save_category_label_for_image/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                category_image: image_id,
                label: rect.name,
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

        const updateStatusResponse = await fetch(
          `http://127.0.0.1:8000/categoryImage/update_category_image_status/${imageid}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: "labeled" }),
          }
        );

        if (!updateStatusResponse.ok) {
          const statusErrorMessage = await updateStatusResponse.text();
          throw new Error(
            `Failed to update image status: ${statusErrorMessage}`
          );
        }

        await get_label_image_id();

        toast.update(toastId, {
          render: "Processing completed",
          type: "success",
          isLoading: false,
          autoClose: 200,
        });
      };
    } catch (error) {
      console.error("Error saving labels:", error);
      toast.update(toastId, {
        render: "Failed to save labels",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleSaveAlreadyLabelImage = async (
    alreadyLabelImageID,
    rectangles
  ) => {
    const token = localStorage.getItem("token");

    try {
      const deleteResponse = await fetch(
        `http://127.0.0.1:8000/categoryImage/delete_label_for_image_category/${alreadyLabelImageID}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!deleteResponse.ok) {
        throw new Error(
          `Failed to delete labels with status ${deleteResponse.status}`
        );
      }

      // Save new labels
      for (const rect of rectangles) {
        const labelResponse = await fetch(
          "http://127.0.0.1:8000/categoryImageSave/save_category_label_for_image/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              category_image: alreadyLabelImageID, // Use the alreadyLabelImageID here
              label: rect.name,
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

      toast.success("Labels saved successfully", { autoClose: 200 });
    } catch (error) {
      console.error("Error saving labels:", error);
      toast.error("Error saving labels");
    }
  };

  useEffect(() => {
    const keyMappings = {
      Condition: {
        KeyD: 0,
        KeyF: 1,
      },
      Grade: {
        KeyF: 0,
        KeyN: 1,
        KeyM: 2,
      },
      Toxicity: {
        KeyT: 0,
        KeyN: 1,
      },
      WasteType: {
        KeyF: 0,
        KeyN: 1,
      },
      Material: {
        KeyT: 0,
        KeyH: 1,
      },
    };

    const handleKeyDown = (e) => {
      const keyMap = keyMappings[category]?.[e.code];
      if (keyMap !== undefined && selectedRectIndex !== null) {
        const newLabel = labelsList[keyMap];
        setSelectedLabel(newLabel);
        setRectangles((rects) =>
          rects.map((rect, index) =>
            index === selectedRectIndex
              ? { ...rect, name: newLabel, color: labelColors[newLabel] }
              : rect
          )
        );
      }
      if (e.key === "Enter" && selectedRectIndex !== null) {
        if (selectedRectIndex + 1 < rectangles.length) {
          setSelectedRectIndex(selectedRectIndex + 1);
        } else {
          const allLabeled = rectangles.every(
            (rect) => rect.name && rect.name.trim() !== ""
          );
          if (allLabeled) {
            if (alreadyLabelImageID === "none") {
              handleSave(rectangles, catId, imageUrl);
            } else {
              handleSaveAlreadyLabelImage(alreadyLabelImageID, rectangles);
            }
          } else {
            toast.error("Please label all rectangles before saving.", {
              autoClose: 3000,
            });
          }
        }
      }
      if (e.key >= "1" && e.key <= "9") {
        const rectIndex = parseInt(e.key) - 1;
        if (rectIndex < rectangles.length) {
          handleRectSelect(rectIndex);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    setSelectedLabel("");
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    selectedRectIndex,
    category,
    labelsList,
    catId,
    handleSave,
    imageUrl,
    rectangles,
    labelColors,
  ]);

  return (
    <>
      <div>
        <div>
          <Stage
            width={Math.min(window.innerWidth, 1000)}
            height={Math.min(window.innerHeight - 30, 800)}
            onMouseDown={handleMouseDown}
          >
            <Layer>
              <KonvaImage image={image} stroke="black" strokeWidth={4} />
              {rectangles.map((rect, i) => (
                <React.Fragment key={i}>
                  <Rect
                    fill={"#" + rect.color || "red"}
                    x={rect.x}
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    stroke={"black" || "red"}
                    strokeWidth={2}
                    opacity={isRectSelected(i) ? 0.6 : 0.2}
                    onClick={() => handleRectSelect(i)}
                  />
                  <Text
                    text={rect.name}
                    x={rect.x + 5}
                    y={rect.y + 5}
                    fontSize={16}
                    fill={selectedRectIndex === i ? "black" : "white"}
                  />
                  <Text
                    text={i + 1}
                    x={rect.x + 5}
                    y={rect.y + 20}
                    fontSize={20}
                    fill={selectedRectIndex === i ? "black" : "white"}
                    color={purple}
                  />
                </React.Fragment>
              ))}
            </Layer>
          </Stage>
        </div>

        <ToastContainer />
      </div>
    </>
  );
};

export default LabelCanvas;
