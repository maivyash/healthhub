import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthAutorization";
import { toast } from "react-toastify";
import Spinner from "../components/spinner";
import { motion } from "framer-motion";
import "../css/profile.css";
import Navbar from "../components/NavBar";

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

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

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
      city: user.user?.city || "",
    };

    setPreviewUrl(
      user.user?.avatarUrl
        ? `${process.env.REACT_APP_SERVER}${user.user.avatarUrl}`
        : "https://api.dicebear.com/7.x/adventurer/svg?seed=yash"
    );

    if (user.role === "doctor") {
      setForm({
        ...common,
        specialization: user.user.specialization || "",
        license: user.user.license || "",
        experience: user.user.experience || "",
        workingDays: user.user.workingDays || [],
      });
    } else if (user.role === "pathologist") {
      setForm({
        ...common,
        license: user.user.license || "",
        labName: user.user.labName || "",
        qualification: user.user.qualification || "",
        workingDays: user.user.workingDays || [],
      });
    } else if (user.role === "patient") {
      setForm({
        ...common,
        age: user.age || "",
        gender: user.user.gender || "",
        medicalHistory: user.user.medicalHistory || "",
      });
    }
  }, [user, loading]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDayToggle = (day) => {
    setForm((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const handleAvatarClick = () => {
    document.getElementById("avatarInput").click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key, v));
        } else {
          formData.append(key, value);
        }
      });

      formData.append("uid", user.id);
      if (image) formData.append("avatar", image);

      const response = await fetch(
        `${process.env.REACT_APP_SERVER}/users/updateprofile`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      toast.success("Profile updated successfully!");
      handleLogout();
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    }
  };

  const handleLogout = async () => {
    await fetch(`${process.env.REACT_APP_SERVER}/login/logout`);
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    toast.success("Logged out");
    navigate("/");
    window.location.reload();
  };

  if (loading || !user) return <Spinner />;

  const workingDaysOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <>
      <Navbar />
      <motion.div
        className="clean-profile-container"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2>Profile</h2>
        <p className="subtext">Manage your profile information</p>

        <div className="user-summary">
          <div className="avatar-wrapper" onClick={handleAvatarClick}>
            <img
              src={previewUrl}
              alt="avatar"
              className="profile-avatar clickable"
            />
            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          </div>
          <div>
            <h3>{form.fullName}</h3>
            {user.role === "doctor" && (
              <p>Specialization: {form.specialization}</p>
            )}
            <p>UID: {user.id}</p>
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
                placeholder="License"
              />
              <input
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="Experience"
              />
            </>
          )}
          {user.role === "pathologist" && (
            <>
              <input
                name="license"
                value={form.license}
                onChange={handleChange}
                placeholder="License"
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
              {workingDaysOptions.map((day) => (
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
        <button className="save-button" onClick={handleLogout}>
          Logout
        </button>
      </motion.div>
    </>
  );
};

export default Profile;
