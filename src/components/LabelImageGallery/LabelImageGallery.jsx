// LabelImageGallery.js
import React, { useState, useEffect } from "react";
import "./labelImageGallery.css";
import Loader from "../../ui_components/Loader/Loader";
import { BaseURL } from "../../constant/BaseUrl";
import LabeLUpdateGallery from "../LabelUpdateGallery/LabeLUpdateGallery";
import ModelUpdateCanvas from "../ModelUpadeCanvas/ModelUpdateCanvas";

const LabelImageGallery = ({ path, projectId }) => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedRectIndex, setSelectedRectIndex] = useState(null);
  const [refreshGallery, setRefreshGallery] = useState(false);

  useEffect(() => {
    if (path === "labeled-images") {
      const fetchCategories = async () => {
        try {
          const response = await fetch(
            `${BaseURL}project/${projectId}/categories/`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const data = await response.json();
          console.log(data, "category data");
          setCategories(data);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      fetchCategories();
    }
  }, [path, projectId]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const loggedInUsername = localStorage.getItem("username");
      let apiUrl = `${BaseURL}lcadmin/${path}/?page=${currentPage}&uploaded_by=${loggedInUsername}`;

      if (categoryFilter) {
        apiUrl += `&category_name=${categoryFilter}`;
      }

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch images.");
      }
      const data = await response.json();
      console.log(data, "mydata");
      setImages(data.results);
      setTotalPages(Math.ceil(data.count / data.page_size));
      setHasMore(currentPage < totalPages);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [currentPage, categoryFilter, path, totalPages]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setSelectedRectIndex(0); // Set selectedRectIndex to 0 when opening modal
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setSelectedRectIndex(null); // Optionally reset when closing
    fetchImages();
  };

  // Inside LabelImageGallery.js
  const generatePageNumbers = () => {
    const pages = [];
    const maxPageNumbersToShow = 5;
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    // Add first page and ellipsis if necessary
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    // Add page numbers within the calculated range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if necessary
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };


  if (loading) {
    return <Loader />;
  }

  const calculateScaleFactor = (width, height) => {
    const saclefacterpercentage = 16000 / width;

    const scalefactor = 100 / saclefacterpercentage;
    return scalefactor;
  };

  return (
    <div>
      {path === "labeled-images" && (
        <div className="filter-container">
          <label htmlFor="categoryFilter">Filter by Category:</label>
          <select
            id="categoryFilter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.category}>
                {category.category}
              </option>
            ))}
          </select>
        </div>
      )}

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
        className={`btn btn-pagination ${currentPage === pageNumber ? "active" : ""}`}
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


      {selectedImage ? (
        <ModelUpdateCanvas
          isOpen={isModalOpen}
          onClose={closeModal}
          projectId={projectId} // Pass projectId
          catId={selectedImage.category} // Pass catId
          category={selectedImage.category_name} // Pass category
        >
          <LabeLUpdateGallery
            image={selectedImage}
            projectId={projectId}
            catId={selectedImage.category} // Pass catId
            category={selectedImage.category_name}
            selectedRectIndex={selectedRectIndex}
            setSelectedRectIndex={setSelectedRectIndex}
          />
        </ModelUpdateCanvas>
      ) : (
        ""
      )}
    </div>
  );
};

export default LabelImageGallery;
