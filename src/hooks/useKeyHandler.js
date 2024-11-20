import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import keyMappings from "../constant/keyMapping";

const useKeyHandler = (
  category,
  selectedRectIndex,
  setSelectedRectIndex,
  setSelectedLabel,
  rectangles,
  setRectangles,
  labelsList,
  labelColors,
  handleSave,
  handleSaveAlreadyLabelImage,
  alreadyLabelImageID,
  catId,
  imageUrl,
  handleRectSelect
) => {
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleKeyDown = async (e) => {
      if (isSaving) {
        e.preventDefault();
        return;
      }

      const keyMap = keyMappings[category]?.[e.code];

      if (keyMap !== undefined && selectedRectIndex !== null) {
        const newLabel = labelsList[keyMap];
        setSelectedLabel(newLabel);
        setRectangles((rects) =>
          rects.map((rect, index) =>
            index === selectedRectIndex
              ? {
                  ...rect,
                  name: newLabel,
                  label: newLabel,
                  color: labelColors[newLabel],
                }
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
            setIsSaving(true); // Start the save process

            try {
              
              if (alreadyLabelImageID === "none") {
                await handleSave(rectangles, catId, imageUrl);
              } else {
                await handleSaveAlreadyLabelImage(
                  alreadyLabelImageID,
                  rectangles
                );
              }
            } catch (error) {
              console.error("Error during saving process:", error);
              toast.error("Error during saving. Please try again.", {
                autoClose: 3000,
              });
            } finally {
              setIsSaving(false); // Ensure that the saving flag is reset
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

      if (e.key === "ArrowRight") {
        const allLabeled = rectangles.every(
          (rect) => rect.name && rect.name.trim() !== ""
        );

        if (!allLabeled) {
          toast.error(
            "Please label and save all rectangles before moving to the next image.",
            {
              autoClose: 3000,
            }
          );
          e.preventDefault();
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
    alreadyLabelImageID,
    handleRectSelect,
    handleSaveAlreadyLabelImage,
    setRectangles,
    setSelectedLabel,
    setSelectedRectIndex,
    isSaving,
  ]);
};

export default useKeyHandler;
