import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthAutorization";
import { toast } from "react-toastify";
import Spinner from "../components/spinner";
import { motion } from "framer-motion";
import "../css/profile.css";

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    license: "",
    labName: "",
    qualification: "",
    specialization: "",
    experience: "",
    age: "",
    gender: "",
    medicalHistory: "",
    city: "",
    workingDays: [],
  });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      toast.error("Please login");
      navigate("/login");
      return;
    }

    const common = {
      fullName: user.name || "",
      email: user.email || "",
      city: user.city || "",
    };

    if (user.role === "doctor") {
      console.log(user);

      setForm({
        ...common,
        specialization: user.specialization || "",
        license: user.license || "",
        experience: user.experience || "",
      });
    } else if (user.role === "pathologist") {
      setForm({
        ...common,
        license: user.license || "",
        labName: user.labName || "",
        qualification: user.qualification || "",
      });
    } else if (user.role === "patient") {
      setForm({
        ...common,
        age: user.age || "",
        gender: user.gender || "",
        medicalHistory: user.medicalHistory || "",
      });
    }
  }, [user, loading]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const workingDaysOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleDayToggle = (day) => {
    setForm((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const handleSave = () => {
    toast.success("Profile saved!");
    // TODO: Send update request to backend
  };

  if (loading || !user) return <Spinner />;

  return (
    <motion.div
      className="clean-profile-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2>Profile</h2>
      <p className="subtext">Manage your profile information</p>

      <div className="user-summary">
        <img
          src="https://api.dicebear.com/7.x/adventurer/svg?seed=yash"
          alt="profile"
          className="profile-avatar"
        />
        <div>
          <h3>{form.fullName || "User"}</h3>
          <p>
            {user.role === "doctor"
              ? `Specialization: ${form.specialization}`
              : null}
          </p>
          {user.license && <p>License: {form.license}</p>}
          <p>UID: {user._id}</p>
        </div>
      </div>

      <h4>Professional Details</h4>
      <div className="form-grid">
        {user.role === "doctor" && (
          <>
            <input
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              placeholder="Specialization"
            />
            <input
              name="license"
              value={form.license}
              onChange={handleChange}
              placeholder="License Number"
            />
            <input
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="Years of Experience"
            />
          </>
        )}

        {user.role === "pathologist" && (
          <>
            <input
              name="license"
              value={form.license}
              onChange={handleChange}
              placeholder="License Number"
            />
            <input
              name="labName"
              value={form.labName}
              onChange={handleChange}
              placeholder="Lab Name"
            />
            <input
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              placeholder="Qualification"
            />
          </>
        )}

        {user.role === "patient" && (
          <>
            <input
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Age"
            />
            <input
              name="gender"
              value={form.gender}
              onChange={handleChange}
              placeholder="Gender"
            />
            <input
              name="medicalHistory"
              value={form.medicalHistory}
              onChange={handleChange}
              placeholder="Medical History"
            />
          </>
        )}

        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          placeholder="City"
        />
      </div>

      {(user.role === "doctor" || user.role === "pathologist") && (
        <>
          <h4>Availability</h4>
          <div className="day-checkboxes">
            {Array.isArray(form.workingDays) &&
              workingDaysOptions.map((day) => (
                <label key={day}>
                  <input
                    type="checkbox"
                    checked={form.workingDays.includes(day)}
                    onChange={() => handleDayToggle(day)}
                  />
                  {day}
                </label>
              ))}
          </div>
        </>
      )}

      <button className="save-button" onClick={handleSave}>
        Save Changes
      </button>
    </motion.div>
  );
};

export default Profile;
