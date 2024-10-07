import React, { useState, useEffect } from "react";
import "./AnnotedImageGallery.css";
import Loader from "../../ui_components/Loader/Loader";
import { BaseURL } from "../../constant/BaseUrl";
import Gallery from "../Gallery/Gallery";
import Modal from "../Model/Model";
import AnnotedUpdateGallery from "../AnnotedUpdateGallery/AnnotedUpdateGallery";

const AnnotedImageGallery = ({ path, projectId }) => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedLabelData, setSelectedLabelData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  // Track when the gallery should refresh
  const [refreshGallery, setRefreshGallery] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const loggedInUsername = localStorage.getItem("username");
      let apiUrl = `${BaseURL}lcadmin/${path}/?page=${currentPage}&uploaded_by=${loggedInUsername}`;

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch images.");
      }
      const data = await response.json();
      setImages(data.results);
      setTotalPages(Math.ceil(data.count / data.page_size));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [currentPage, path, refreshGallery]); // Added `refreshGallery` to re-fetch images when it changes

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setSelectedLabelData(image.labels || []);
    setIsModalOpen(true); // Open the modal when an image is clicked
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const generatePageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedImage(null); // Clear the selected image
    setSelectedLabelData([]); // Clear the selected label data
    fetchImages();
  };

  // Callback to refresh gallery after saving the image
  const handleImageUpdate = () => {
    closeModal(); // Close the modal after update
    setRefreshGallery((prev) => !prev); // Toggle refresh to trigger the useEffect and fetch the updated data
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="image-gallery">
        {images.map((image) => (
          <div
            className="card"
            key={image.id}
            onClick={() => handleImageClick(image)}
          >
            <div>
              <div className="thumbnail">
                <img src={image.firebase_url} alt={image.filename} />
                {image.labels &&
                  image.labels.map((label, index) => (
                    <div
                      key={index}
                      className="label"
                      style={{
                        left: `${label.x / 4}px`,
                        top: `${label.y / 4}px`,
                        width: `${label.width / 4}px`,
                        height: `${label.height / 4}px`,
                      }}
                    >
                      {label.label}
                    </div>
                  ))}
              </div>
              {image.uploaded_by && (
                <p className="m-2">uploaded_by {image.uploaded_by}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        {generatePageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            className={`btn btn-pagination ${
              currentPage === pageNumber ? "active" : ""
            }`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedImage && (
          <AnnotedUpdateGallery
            projectId={projectId}
            initialImage={selectedImage}
            initallabelData={selectedLabelData}
            onImageUpdate={handleImageUpdate} // Pass the callback to trigger refresh
          />
        )}
      </Modal>
    </div>
  );
};

export default AnnotedImageGallery;
