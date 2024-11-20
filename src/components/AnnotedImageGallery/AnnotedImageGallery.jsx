import React, { useState, useEffect } from "react";
import "./AnnotedImageGallery.css";
import Loader from "../../ui_components/Loader/Loader";
import { BaseURL } from "../../constant/BaseUrl";
import Modal from "../Model/Model";
import AnnotedUpdateGallery from "../AnnotedUpdateGallery/AnnotedUpdateGallery";

const AnnotedImageGallery = ({ path, projectId }) => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedLabelData, setSelectedLabelData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      console.log(data);
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
  }, [currentPage, path, refreshGallery]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setSelectedLabelData(image.labels || []);
    setIsModalOpen(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const generatePageNumbers = () => {
  const pages = [];
  const maxPagesToShow = 5; // Adjust the number of pages to show as needed

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    if (currentPage > 3) {
      pages.push("...");
    }
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }
    pages.push(totalPages);
  }

  return pages;
};


  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setSelectedLabelData([]);
    fetchImages();
  };

  const handleImageUpdate = () => {
    closeModal();
    setRefreshGallery((prev) => !prev);
  };

  const calculateScaleFactor = (width, height) => {
    const saclefacterpercentage = 16000 / width;

    const scalefactor = 100 / saclefacterpercentage;
    return scalefactor;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <div className="image-gallery">
        {images.map((image) => {
          const scaleFactor = calculateScaleFactor(
            image.image_width,
            image.image_height
          );

          return (
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
                          left: `${label.x / scaleFactor}px`,
                          top: `${label.y / scaleFactor}px`,
                          width: `${label.width / scaleFactor}px`,
                          height: `${label.height / scaleFactor}px`,
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
          );
        })}
      </div>

        <div className="pagination">
        {generatePageNumbers().map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <span key={index} className="pagination-ellipsis">
                {pageNumber}
              </span>
            );
          }
          return (
            <button
              key={pageNumber}
              className={`btn btn-pagination ${
                currentPage === pageNumber ? "active" : ""
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
        {/* Next Page Button */}
        {currentPage < totalPages && (
          <button
            className="btn btn-pagination"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {selectedImage && (
          <AnnotedUpdateGallery
            projectId={projectId}
            initialImage={selectedImage}
            initallabelData={selectedLabelData}
            onImageUpdate={handleImageUpdate}
          />
        )}
      </Modal>
    </div>
  );
};

export default AnnotedImageGallery;
