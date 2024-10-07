import React, { useState, useEffect } from "react";
import "./OriginalImageGallery.css";
import Loader from "../../ui_components/Loader/Loader";
import { BaseURL } from "../../constant/BaseUrl";

const OriginalImageGallery = ({ path, projectId }) => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
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
        setHasMore(currentPage < totalPages);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [currentPage, path]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5; // Maximum number of pages to show (excluding ellipses)

    if (totalPages <= maxPagesToShow) {
      // If total pages are less than or equal to the max, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Add first page
      pages.push(1);

      // Add ellipsis if necessary
      if (currentPage > 3) {
        pages.push("...");
      }

      // Add current page and surrounding pages
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if necessary
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Add last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {/* Image Gallery */}
      <div className="image-gallery">
        {images.map((image) => (
          <div className="card" key={image.id}>
            <div>
              <div className="thumbnail">
                <img src={image.firebase_url} alt={image.filename} />
              </div>
              {image.uploaded_by && (
                <p className="m-2">uploaded_by {image.uploaded_by}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
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
    </div>
  );
};

export default OriginalImageGallery;
