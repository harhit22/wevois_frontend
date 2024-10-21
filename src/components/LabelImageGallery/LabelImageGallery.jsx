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

  useEffect(() => {
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
        setImages(data.results);
        setTotalPages(Math.ceil(data.count / data.page_size));
        setHasMore(currentPage < totalPages);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

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
  };

  const generatePageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading) {
    return <Loader />;
  }

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
        {images.map((image) => (
          <div
            className="card"
            key={image.id}
            onClick={() => handleImageClick(image)} // Open modal on image click
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
              <div className="meta-data">
                <p>{image.filename}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        {generatePageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            disabled={pageNumber === currentPage}
          >
            {pageNumber}
          </button>
        ))}
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
