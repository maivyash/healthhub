// src/components/Spinner.js
import React from "react";
import "../css/Spinner.css";

const Spinner = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
    <p>Uploading...</p>
  </div>
);

export default Spinner;
