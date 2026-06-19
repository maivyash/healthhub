import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import { motion, AnimatePresence } from "framer-motion";
import "../css/FindDoctorCss.css";
import { toast } from "react-toastify";
import { useAuth } from "../components/AuthAutorization"; // add this
const { useNavigate } = require("react-router-dom");

// Inside component

const FindDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [popup, setPopup] = useState({
    visible: false,
    doctor: null,
    form: {},
  });
  const { user, loading } = useAuth(); // get current user
  const navigate = useNavigate();
  const fetchDoctors = () =>
    fetch(`${process.env.REACT_APP_SERVER}/users/doctors`).then((res) =>
      res.json()
    );

  const bookAppointment = (data) => {
    console.log(data);

    return fetch(`${process.env.REACT_APP_SERVER}/bookings/book`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  useEffect(() => {
    fetchDoctors().then((res) => setDoctors(res.doctors || []));
  }, []);

  const openPopup = (doctor) =>
    setPopup({ visible: true, doctor, form: { date: "", time: "" } });

  const handleFormChange = (e) =>
    setPopup((p) => ({
      ...p,
      form: { ...p.form, [e.target.name]: e.target.value },
    }));

  const handleBook = async (e) => {
    if (loading) {
      return;
    }
    if (!user) {
      toast.error("Please Login");
      navigate("/login");
      return;
    }
    e.preventDefault();
    const { patientName, problem, description, date, time } = popup.form;

    const resp = await bookAppointment({
      doctorId: popup.doctor._id,
      patientId: user.id, // 🟢 pass patient id
      problem,
      description,
      date,
      time,
    });
    if (resp.ok) {
      toast.success("Successfull  Booking");
      setPopup({ visible: false });
    } else {
      toast.error("Unable to Book Appoitment  SERVER SIDE ISSUE");
    }
  };

  return (
    <>
      <Navbar />
      <div className="find-doctor-container">
        <h1>Find a doctor</h1>
        <div className="doctor-list">
          {doctors.map((doc) => (
            <div key={doc._id} className="doctor-card">
              <div>
                <img
                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${doc.fullName}`}
                  alt={doc.fullName}
                />
                <h3>{doc.fullName}</h3>
                <p>{doc.specialization}</p>
                <p>{doc.workingDays?.join(", ")}</p>
              </div>
              <button onClick={() => openPopup(doc)}>Book Now</button>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {popup.visible && (
            <motion.div
              className="popup-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="popup-content"
                initial={{ scale: 0.8, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Book Appointment with {popup.doctor.fullName}</h2>
                <form onSubmit={handleBook} className="booking-form">
                  <input
                    name="patientName"
                    placeholder="Your full name"
                    required
                    onChange={handleFormChange}
                  />
                  <input
                    name="problem"
                    placeholder="Health issue (required)"
                    required
                    onChange={handleFormChange}
                  />
                  <textarea
                    name="description"
                    placeholder="Describe your problem"
                    rows={3}
                    onChange={handleFormChange}
                  />
                  <div className="datetime-group">
                    <label>
                      Select Date:
                      <input
                        type="date"
                        name="date"
                        required
                        onChange={handleFormChange}
                      />
                    </label>
                    <label>
                      Select Time:
                      <input
                        type="time"
                        name="time"
                        required
                        onChange={handleFormChange}
                      />
                    </label>
                  </div>
                  <div className="popup-buttons">
                    <button type="submit" className="confirm-btn">
                      Confirm Booking
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setPopup({ visible: false })}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default FindDoctor;
