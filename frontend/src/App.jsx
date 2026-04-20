/**
 * App.jsx
 *
 * Main frontend entry point for the aircraft defect detection demo.
 *
 * Responsibilities:
 * - Manage selected image + detection state
 * - Fetch detection results from backend API
 * - Render image with overlayed bounding boxes
 * - Display detection summary panel
 */

import { useEffect, useRef, useState } from "react";

// Demo images available for selection
const demoImages = ["img1.png", "img2.png", "img3.png"];

// Instructions associated with each demo image
const imageInstructions = {
  "img1.png": "Turn on communications and tune avionics.",
  "img2.png": "Check rivet integrity.",
  "img3.png":
    "Major structural damage detected on aircraft body and blade. Urgent technician review required.",
};

export default function App() {
  // State

  const [selectedImage, setSelectedImage] = useState(demoImages[0]);
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });

  // Reference to image DOM element (used for sizing calculations)
  const imageRef = useRef(null);

  // Fetch detections whenever selected image changes
  useEffect(() => {
    fetchDetections(selectedImage);
  }, [selectedImage]);

  /**
   * Call backend API to retrieve detections for a given image.
   */
  async function fetchDetections(imageName) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_name: imageName }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch detections from backend.");
      }

      const data = await response.json();

      // Backend returns normalized YOLO-style detections
      setDetections(data.detections || []);
    } catch (err) {
      console.error(err);
      setError("Could not load detections.");
      setDetections([]);
    } finally {
      setLoading(false);
    }
  }

  function updateDisplaySize() {
    if (!imageRef.current) {
      return;
    }

    setDisplaySize({
      width: imageRef.current.clientWidth,
      height: imageRef.current.clientHeight,
    });
  }

  // Handle window resize to keep overlay aligned
  useEffect(() => {
    function handleResize() {
      updateDisplaySize();
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="app-shell">
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="app-eyebrow">Inspection Console</div>
          <h1 className="app-title">Aircraft Defect Detection Demo</h1>
          <p className="app-subtitle">
            Prototype visualization using sample non-proprietary aircraft inspection images.
          </p>
        </header>

        {/* Image Selection Controls */}
        <div className="control-bar">
          <label htmlFor="image-select" className="control-label">
            Select demo image:
          </label>
          <select
            id="image-select"
            className="control-select"
            value={selectedImage}
            onChange={(e) => setSelectedImage(e.target.value)}
          >
            {demoImages.map((imageName) => (
              <option key={imageName} value={imageName}>
                {imageName}
              </option>
            ))}
          </select>
        </div>
        {/* Inspection Instructions Panel */}
            <div className="panel">
            <div className="panel-content">
                <h2 className="panel-title">Inspection Notes</h2>

                <p className="summary-meta">
                Image: <strong>{selectedImage}</strong>
                </p>
                <div
                className={`instruction-box ${
                    selectedImage === "img3.png" ? "instruction-urgent" : ""
                }`}
                >
                {imageInstructions[selectedImage]}
                </div>
            </div>
            </div>


        {/* Status messages */}
        {loading && (
          <p className="status-message status-loading">Running detection...</p>
        )}

        {error && (
          <p className="status-message status-error">{error}</p>
        )}

        <div className="dashboard-grid">
            {/* Detection View (Image + Boxes) */}
            <div className="panel">
            <div className="panel-content">
              <h2 className="panel-title">Detection View</h2>

              <div className="viewer-frame">
                <img
                  ref={imageRef}
                  src={`/images/${selectedImage}`}
                  alt={selectedImage}
                  onLoad={updateDisplaySize}
                  className="viewer-image"
                />

                {/* Render bounding boxes only once image size is known */}
                {displaySize.width > 0 &&
                  detections.map((detection, index) => {
                    /**
                     * Convert YOLO normalized coordinates pixel values.
                     */
                    const x =
                      (detection.x_center - detection.width / 2) *
                      displaySize.width;
                    const y =
                      (detection.y_center - detection.height / 2) *
                      displaySize.height;
                    const boxWidth = detection.width * displaySize.width;
                    const boxHeight = detection.height * displaySize.height;

                    return (
                      <div
                        key={`${selectedImage}-${index}`}
                        className="detection-box"
                        style={{
                          left: `${x}px`,
                          top: `${y}px`,
                          width: `${boxWidth}px`,
                          height: `${boxHeight}px`,
                        }}
                      >
                        <div className="detection-label">
                          {detection.label}{" "}
                          {Math.round(detection.confidence * 100)}%
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            </div>

           {/* Detection Summary Panel */}
           <div className="panel">
            <div className="panel-content">
              <h2 className="panel-title">Detection Summary</h2>

              <p className="summary-meta">
                Image: <strong>{selectedImage}</strong>
              </p>

              <p className="summary-meta">
                Total detections: <strong>{detections.length}</strong>
              </p>

              <div>
                {detections.length === 0 ? (
                  <p className="summary-empty">No detections found.</p>
                ) : (
                  detections.map((detection, index) => (
                    <div key={`summary-${index}`} className="detection-card">
                      <div className="detection-card-title">
                        {detection.label}
                      </div>
                      <div className="detection-card-row">
                        Confidence: {Math.round(detection.confidence * 100)}%
                      </div>
                      <div className="detection-card-row">
                        Center: ({detection.x_center.toFixed(3)},{" "}
                        {detection.y_center.toFixed(3)})
                      </div>
                      <div className="detection-card-row">
                        Size: {detection.width.toFixed(3)} ×{" "}
                        {detection.height.toFixed(3)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            </div>
          

            
        </div>
      </div>
    </div>
  );
}