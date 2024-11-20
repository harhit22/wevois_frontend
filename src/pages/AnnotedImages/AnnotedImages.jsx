import React, { useState, useEffect } from "react";
import Navbar from "../../components/basic/navbar/navbar";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { fetchProjectsCategory } from "../../pages_services/AnnotatedImages/fetcgProjectCategory";
import { BaseURL } from "../../constant/BaseUrl";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

const AnnotatedImages = () => {
  const { projectId } = useParams();
  const [projectCategory, setProjectCategory] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [trainCount, setTrainCount] = useState(0);
  const [valCount, setValCount] = useState(0);
  const [testCount, setTestCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [totalImages, setTotalImages] = useState(0);
  const [blurImages, setBlurImages] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchProjectsCategory(projectId, setProjectCategory);
  }, [projectId]);

  const fetchTotalImages = async (categoryId) => {
    try {
      const response = await fetch(
        `${BaseURL}project/yolov8/category-image-count/?category_id=${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTotalImages(data.total_images);
      } else {
        console.error("Failed to fetch total images");
      }
    } catch (error) {
      console.error("Error fetching total images:", error);
    }
  };

  const handleShowModal = async (category) => {
    setSelectedCategory(category);
    setShowModal(true);
    setDownloadProgress(0); // Reset progress when opening modal

    // Fetch total images for the selected category
    await fetchTotalImages(category.id);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDownloadProgress(0); // Reset progress on close
    setTrainCount(0);
    setValCount(0);
    setTestCount(0);
  };

  const fakeDownloadProgress = () => {
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 1; // Increase progress by 10%
      });
    }, 500); // Update progress every 500ms
  };

  const handleDownload = async () => {
    setShowProgress(true);
    fakeDownloadProgress(); // Start fake progress

    const { id, category } = selectedCategory;

    const url = new URL(`${BaseURL}project/yolov8/download-dataset/`);
    url.searchParams.append("category_id", id);
    url.searchParams.append("category_name", category);
    url.searchParams.append("train_count", trainCount);
    url.searchParams.append("val_count", valCount);
    url.searchParams.append("test_count", testCount);
    url.searchParams.append("blur_images", blurImages);

    const xhr = new XMLHttpRequest();
    xhr.timeout = 0;
    xhr.open("POST", url.toString(), true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    xhr.onload = async () => {
      
      if (xhr.status === 202) {
        const data = xhr.response;
        const taskId = data.task_id; // Assume task_id is returned upon initiating download
        trackTaskStatus(taskId); // Start tracking task status
      } else {
        console.error("Error downloading dataset:", xhr.statusText);
        alert("Failed to download dataset. Please try again.");
        setDownloadProgress(0);
      }
    };

    xhr.onerror = () => {
      setShowProgress(false);
      console.error("Error downloading dataset.");
      alert("Failed to download dataset. Please try again.");
      setDownloadProgress(0);
    };

    xhr.responseType = "json";
    xhr.send(
      JSON.stringify({
        category_id: id,
        category_name: category,
        train_count: trainCount,
        val_count: valCount,
        test_count: testCount,
        blur_images: blurImages,
      })
    );
  };

  // Function to poll for task status
  const trackTaskStatus = async (taskId) => {
    let downloadStarted = false;
  
    const interval = setInterval(async () => {
      if (downloadStarted) {
        clearInterval(interval);
        return;
      }
  
      try {
        const response = await fetch(
          `${BaseURL}project/yolov8/task-status/?task_id=${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            cache: "no-store", // Ensures a fresh request each time
          }
        );
  
        const contentType = response.headers.get("Content-Type");
  
        if (response.ok && contentType && contentType.includes("application/zip")) {
          // Task complete, download only if not already started
          downloadStarted = true;
          clearInterval(interval);
  
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "dataset.zip";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          alert("Download complete!");
        } else {
          // Handle JSON response for in-progress or failed status
          const data = await response.json();
  
          if (data.status === "failed") {
            alert("Task failed: " + (data.message || "Unknown error"));
            clearInterval(interval);
          } else if (data.status === "In progress") {
            setDownloadProgress((prev) => Math.min(prev + 10, 100)); // Update progress indicator
          }
        }
      } catch (error) {
        clearInterval(interval);
        console.error("Error tracking task status:", error);
        alert("Error tracking task status. Please try again.");
      }
    }, 5000); // Poll every 5 seconds
  };
  

  const handleCountChange = (type, value) => {
    const totalCount = trainCount + valCount + testCount;

    if (type === "train") {
      if (value >= 0 && totalCount - trainCount + value <= totalImages) {
        setTrainCount(value);
      }
    } else if (type === "val") {
      if (value >= 0 && totalCount - valCount + value <= totalImages) {
        setValCount(value);
      }
    } else if (type === "test") {
      if (value >= 0 && totalCount - testCount + value <= totalImages) {
        setTestCount(value);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row dash_back">
          <nav className="col-md-2 d-none d-md-block sidebar_background sidebar sidebar-category">
            <div className="sidebar-sticky">
              <h5 className="sidebar-heading ml-2">Download dataset</h5>
              <ul className="nav flex-column">
                <li>
                  <img
                    src="https://t3.ftcdn.net/jpg/05/90/82/32/360_F_590823233_97YNah2bYsEW9llwf7UNK5L3r1cM0Ei3.jpg"
                    alt=""
                    width="80%"
                    style={{ paddingLeft: "30px" }}
                  />
                </li>
                <br />
                <hr />
                {projectCategory.map((cat) => (
                  <React.Fragment key={cat.id}>
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="category-name">{cat.category}</span>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleShowModal(cat)}
                        title="Download Dataset"
                      >
                        <i className="fa fa-download"></i>
                      </button>
                    </li>
                    <hr />
                    <br />
                  </React.Fragment>
                ))}
              </ul>
            </div>
          </nav>
          <main className="col-md-9 ml-sm-auto col-lg-10 px-4">
            <div className="row">
              {projectCategory.map((cat) => (
                <div className="col-lg-4 col-md-6 mb-4 mt-2" key={cat.id}>
                  <div className="card h-100 position-relative">
                    <button
                      className="btn btn-outline-primary position-absolute top-0 end-0 mt-2 me-2"
                      onClick={() => handleShowModal(cat)}
                    >
                      <i className="fa fa-download"></i>
                    </button>
                    <div className="card-body">
                      <h5 className="card-title">{cat.category}</h5>
                      <hr />
                      <p className="card-text">
                        Here you can view and label images for the{" "}
                        {cat.category} category.
                      </p>
                      <NavLink
                        className="btn btn-primary"
                        to={`/labelCategory/${cat.id}/${cat.category}/${projectId}`}
                      >
                        {cat.category}
                      </NavLink>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Modal for selecting image counts */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Download Dataset for {selectedCategory.category}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>total_images: {totalImages}</p>
            <label>Training Images: {trainCount}</label>
            <input
              type="range"
              min="0"
              max={totalImages}
              value={trainCount}
              onChange={(e) =>
                handleCountChange("train", Number(e.target.value))
              }
            />
          </div>
          <div>
            <label>Validation Images: {valCount}</label>
            <input
              type="range"
              min="0"
              max={totalImages - trainCount - testCount}
              value={valCount}
              onChange={(e) => handleCountChange("val", Number(e.target.value))}
            />
          </div>
          <div>
            <label>Test Images: {testCount}</label>
            <input
              type="range"
              min="0"
              max={totalImages - trainCount - valCount}
              value={testCount}
              onChange={(e) =>
                handleCountChange("test", Number(e.target.value))
              }
            />
          </div>
          <div className="form-check mt-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="blurCheckbox"
              checked={blurImages}
              onChange={(e) => setBlurImages(e.target.value)}
            />
            <label className="form-check-label" htmlFor="blurCheckbox">
              Blur Images
            </label>
          </div>
          {showProgress && (
            <div className="progress mt-3">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${downloadProgress}%` }}
                aria-valuenow={downloadProgress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {downloadProgress}%
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={handleDownload}
            disabled={downloadProgress > 0 && downloadProgress < 100}
          >
            Download
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AnnotatedImages;
