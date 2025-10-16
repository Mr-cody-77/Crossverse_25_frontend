import React from "react";
import "./LoadingOverlay.css"; // Move CSS into a separate file for better organization

const LoadingOverlay = () => {
  return (
    <div className="overlay">
      <div className="spinner"></div>
      <div className="label">Submitting...</div>
    </div>
  );
};

export default LoadingOverlay;