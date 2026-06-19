import React from "react";
import Navbar from "../components/NavBar"; // Adjust the path if needed
import "../css/BookingInfo.css"; // Optional custom styles
import { Navigate } from "react-router-dom";

const BookingInfo = () => {
  return (
    <>
      <Navbar />
      <div
        className="booking-info-container"
        style={{ padding: "2rem 1.5rem", maxWidth: "960px", margin: "auto" }}
      >
        <h2 style={{ fontSize: "2rem", fontWeight: "bold" }}>
          Know more about online booking
        </h2>
        <p style={{ marginTop: "0.5rem", color: "#555" }}>
          HealthHub is a platform that connects patients with healthcare
          providers, making it easier to book appointments online. This page
          provides detailed information about how the booking process works,
          appointment statistics, and features available for managing
          appointments.
        </p>

        <section style={{ marginTop: "2rem" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            How online booking works
          </h3>
          <p style={{ marginTop: "0.5rem", color: "#555" }}>
            Online booking simplifies the process for both patients and doctors.
            Patients can easily find and book appointments with doctors based on
            their availability, specialization, and location. Doctors can manage
            their schedules, reduce no-shows, and reach a wider patient base.
          </p>
        </section>

        <section style={{ marginTop: "2.5rem" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Appointment statistics
          </h3>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              marginTop: "1rem",
            }}
          >
            <StatCard label="Total appointments booked" value="12,500+" />
            <StatCard label="Patient satisfaction rate" value="95%" />
            <StatCard label="Average appointment duration" value="30 minutes" />
          </div>
        </section>

        <section style={{ marginTop: "2.5rem" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Features for managing appointments
          </h3>
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <FeatureCard
              icon="📅"
              title="Appointment dashboard"
              desc="View and manage all your appointments in one place."
            />
            <FeatureCard
              icon="🔔"
              title="Automated reminders"
              desc="Send automated reminders to patients to reduce no-shows."
            />
            <FeatureCard
              icon="🕒"
              title="Schedule management"
              desc="Customize your availability and manage your schedule efficiently."
            />
            <FeatureCard
              icon="💬"
              title="Patient communication"
              desc="Communicate with patients directly through the platform."
            />
          </div>
        </section>

        <div style={{ marginTop: "2.5rem" }}>

        </div>
      </div>
    </>
  );
};

const StatCard = ({ label, value }) => (
  <div
    style={{
      flex: "1",
      minWidth: "200px",
      border: "1px solid #ddd",
      borderRadius: "12px",
      padding: "1rem",
      textAlign: "center",
    }}
  >
    <p style={{ color: "#555" }}>{label}</p>
    <p style={{ fontSize: "1.25rem", fontWeight: "bold", marginTop: "0.5rem" }}>
      {value}
    </p>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
    <div
      style={{
        backgroundColor: "#f0f0f0",
        borderRadius: "10px",
        padding: "0.6rem",
        fontSize: "1.5rem",
      }}
    >
      {icon}
    </div>
    <div>
      <p style={{ fontWeight: "600" }}>{title}</p>
      <p style={{ color: "#666", fontSize: "0.95rem" }}>{desc}</p>
    </div>
  </div>
);

export default BookingInfo;
