import React from "react";
import "../css/HeroSectionHomePatient.css";
import doctorsImage from "../asset/doctors.png";

const HeroSection = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1>Your Health in Your</h1>
        <h1 className="fingertips">Fingertips</h1>
        <div className="features">
          <div className="card">
            📞
            <br />
            book doctors
            <br />
            consultation online
          </div>
          <div className="card">
            📁
            <br />
            medical history
            <br />
            records
          </div>
          <div className="card">
            🤖
            <br />
            AI powered
            <br />
            personal assistance
          </div>
        </div>
      </div>
      <div className="hero-image">
        <img src={doctorsImage} alt="Doctors" />
      </div>

      <h1>We Provide</h1>
      <div className="features">
        <div className="card">
          📞
          <br />
          book doctors
          <br />
          consultation online
        </div>
        <div className="card">
          📁
          <br />
          medical history
          <br />
          records
        </div>
        <div className="card">
          🤖
          <br />
          AI powered
          <br />
          personal assistance
        </div>
        <div className="card">
          🤖
          <br />
          AI powered
          <br />
          personal assistance
        </div>
        <div className="card">
          🤖
          <br />
          AI powered
          <br />
          personal assistance
        </div>
        <div className="card">
          🤖
          <br />
          AI powered
          <br />
          personal assistance
        </div>
        <div className="card">
          🤖
          <br />
          AI powered
          <br />
          personal assistance
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
