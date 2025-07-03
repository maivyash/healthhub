import React, { useEffect, useState } from "react";
import { useAuth } from "../components/AuthAutorization";
import { toast } from "react-toastify";
import Navbar from "../components/NavBar";
import Spinner from "../components/spinner";
import "../css/viewAppointment.css";

const ViewAppointment = () => {
  const { user, loading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "status-confirmed";
      case "pending":
        return "status-pending";
      case "rejected":
        return "status-rejected";
      default:
        return "status-unknown";
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER}/bookings/doctor/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Error loading appointments");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER}/bookings/status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      toast.success(result.message);
      fetchAppointments(); // Refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    if (!loading && user?.role === "doctor") {
      fetchAppointments();
    }
  }, [user, loading]);

  if (loading) return <Spinner />;

  if (!user || user.role !== "doctor") {
    return (
      <>
        <Navbar />
        <div className="appointment-container">
          <h2>Access Denied</h2>
          <p>You must be logged in as a doctor to view appointments.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="appointment-container">
        <h1>My Appointments</h1>
        {isLoading ? (
          <div className="loading">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <ul className="appointment-list">
            {appointments.map((appt) => (
              <li key={appt._id} className="appointment-card">
                <h3>{appt.patient?.fullName || "Patient"}</h3>

                <p>
                  <strong>Date:</strong> {formatDate(appt.date)} |{" "}
                  <strong>Time:</strong> {appt.time}
                </p>
                <p>
                  <strong>Problem:</strong> {appt.problem}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {appt.description || "Not provided"}
                </p>
                <span
                  className={`appointment-status ${getStatusClass(
                    appt.status
                  )}`}
                >
                  {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                </span>

                {appt.status === "pending" && (
                  <div className="action-buttons">
                    <button
                      onClick={() => updateStatus(appt._id, "confirmed")}
                      className="confirm-btn"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateStatus(appt._id, "rejected")}
                      className="reject-btn"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default ViewAppointment;
