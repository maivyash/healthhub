import React from "react";
import Navbar from "../components/NavBar";
import "../css/SecurityInfo.css";
import { Navigate } from "react-router-dom";

const SecurityInfo = () => {
  return (
    <>
      <Navbar />
      <div className="security-container">
        <h1 className="security-title">
          Your medical history, securely stored
        </h1>
        <p className="security-subtitle">
          HealthHub uses advanced encryption and strict access controls to
          protect your medical history. We comply with all relevant privacy
          regulations to ensure your data remains confidential and secure.
        </p>

        <h2 className="security-section-title">Key Features</h2>

        <div className="security-feature-list">
          <SecurityFeature
            icon="🛡️"
            title="Data Encryption"
            desc="Your medical data is encrypted using industry-leading standards, ensuring it remains unreadable to unauthorized parties."
          />
          <SecurityFeature
            icon="🔒"
            title="Access Control"
            desc="Only authorized personnel, such as your healthcare providers, can access your medical history, and only with your consent."
          />
          <SecurityFeature
            icon="📜"
            title="Regulatory Compliance"
            desc="We adhere to all relevant data privacy laws and regulations, including HIPAA, to protect your personal health information."
          />
          <SecurityFeature
            icon="🔍"
            title="Security Audits"
            desc="Our systems are regularly audited and tested to ensure they meet the highest security standards and protect against potential threats."
          />
          <SecurityFeature
            icon="⚙️"
            title="User Control"
            desc="You have full control over your medical history, including the ability to review, update, and manage who has access to your information."
          />
        </div>

        <div className="security-footer">
          <button
            className="learn-more-button"
            onClick={() => {
              Navigate("/yetocome");
            }}
          >
            Learn more about our security practices
          </button>
        </div>
      </div>
    </>
  );
};

const SecurityFeature = ({ icon, title, desc }) => (
  <div className="security-feature">
    <div className="security-icon">{icon}</div>
    <div className="security-text">
      <p className="security-feature-title">{title}</p>
      <p className="security-feature-desc">{desc}</p>
    </div>
  </div>
);

export default SecurityInfo;
