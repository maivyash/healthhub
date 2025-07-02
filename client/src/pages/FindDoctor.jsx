// src/pages/FindDoctor.jsx
import React from "react";
import Navbar from "../components/NavBar";

import "../css/FindDoctorCss.css";

const doctors = [
  {
    name: "Dr. Emily Carter",
    availability: "Mon–Fri, 9 AM – 5 PM",
    specialty: "Cardiology",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Emily",
  },
  {
    name: "Dr. David Lee",
    availability: "Tue–Thu, 10 AM – 4 PM",
    specialty: "Pediatrics",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=David",
  },
  {
    name: "Dr. Sarah Chen",
    availability: "Mon, Wed, Fri, 11 AM – 6 PM",
    specialty: "Dermatology",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah",
  },
  {
    name: "Dr. Michael Johnson",
    availability: "Tue, Thu, Sat, 8 AM – 2 PM",
    specialty: "Orthopedics",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Michael",
  },
];

const filters = ["Today", "Any time", "Any city"];

const FindDoctor = () => {
  return (
    <>
      <Navbar />
      <div className="find-doctor-container">
        <h1 className="page-title">Find a doctor</h1>

        <input
          className="search-bar"
          type="text"
          placeholder="Search by name, specialty, or condition"
        />

        <div className="filters">
          {filters.map((filter, i) => (
            <button key={i} className="filter-btn">
              {filter}
            </button>
          ))}
        </div>

        <h2 className="section-title">Available Doctors</h2>

        <div className="doctor-list">
          {doctors.map((doc, index) => (
            <div key={index} className="doctor-card">
              <div className="doc-left">
                <img src={doc.avatar} alt={doc.name} className="doc-avatar" />
                <div>
                  <h3 className="doc-name">{doc.name}</h3>
                  <p className="doc-availability">
                    Available: {doc.availability}
                  </p>
                  <p className="doc-specialty">{doc.specialty}</p>
                </div>
              </div>
              <button className="book-btn">Book</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FindDoctor;
