import { useState, useEffect } from "react";

const useImage = (src) => {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!src) {
      setImage(null);
      setStatus("loading");
      return;
    }

    const img = new Image();
    img.src = src;

    const onLoad = () => {
      setImage(img);
      setStatus("loaded");
    };

    const onError = () => {
      setImage(null);
      setStatus("failed");
    };

    img.addEventListener("load", onLoad);
    img.addEventListener("error", onError);

    return () => {
      img.removeEventListener("load", onLoad);
      img.removeEventListener("error", onError);
    };
  }, [src]);

  return [image, status];
};

export default useImage;
