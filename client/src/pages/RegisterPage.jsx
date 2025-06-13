import React, { useState, useRef, useEffect } from "react";
import "../css/registerpage.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const images = {
  doctor: "/loginpage/doctors.png",
  patient: "/loginpage/patients.png",
  pathologist: "/loginpage/pathologist.png",
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const inputRefs = useRef({}); // Store refs for inputs

  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      const firstErrorField = Object.keys(formErrors)[0];
      if (inputRefs.current[firstErrorField]) {
        inputRefs.current[firstErrorField].focus();
      }
    }
  }, [formErrors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = {
      doctor: ["fullName", "email", "specialization", "license", "experience"],
      pathologist: ["fullName", "labName", "email", "qualification", "license"],
      patient: ["fullName", "email", "age", "gender", "medicalHistory"],
    };

    const fields = requiredFields[role] || [];

    fields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = "This field is required";
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast.error("Please fix the errors");
      return;
    }

    toast.success("Form submitted successfully!");
    sendToBackend({ role, ...formData });
  };

  const sendToBackend = async (data) => {
    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Registration successful!");
        setTimeout(() => navigate("/", { replace: true }), 1000);
      } else {
        switch (response.status) {
          case 409:
            toast.error("Email already registered!");
            break;
          case 406:
            toast.error("Invalid role");
            break;
          case 500:
            toast.error("Server error");
            break;
          default:
            toast.error(result.message || "Something went wrong");
        }
      }
    } catch (err) {
      toast.error("Failed to connect to server");
      console.error(err);
    }
  };

  const renderInput = (name, placeholder, type = "text") => (
    <div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        ref={(el) => (inputRefs.current[name] = el)}
      />
      {formErrors[name] && <span className="error">{formErrors[name]}</span>}
    </div>
  );

  const renderFormFields = () => {
    switch (role) {
      case "doctor":
        return (
          <>
            <h2>Doctor Registration</h2>
            {renderInput("fullName", "Full Name")}
            {renderInput("email", "Email", "email")}
            {renderInput("password", "Password", "password")}

            {renderInput("specialization", "Specialization")}
            {renderInput("license", "License Number")}
            {renderInput("experience", "Years of Experience")}
          </>
        );
      case "pathologist":
        return (
          <>
            <h2>Pathologist Registration</h2>
            {renderInput("fullName", "Full Name")}
            {renderInput("labName", "Lab Name")}
            {renderInput("email", "Email", "email")}
            {renderInput("password", "Password", "password")}

            {renderInput("qualification", "Qualification")}
            {renderInput("license", "Lab License Number")}
          </>
        );
      case "patient":
        return (
          <>
            <h2>Patient Registration</h2>
            {renderInput("fullName", "Full Name")}
            {renderInput("email", "Email", "email")}
            {renderInput("password", "Password", "password")}

            {renderInput("age", "Age")}
            {renderInput("gender", "Gender")}
            {renderInput("medicalHistory", "Medical History")}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="main-rg">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="register-page">
        <div className="left-image">
          {role && <img src={images[role]} alt="Role Visual" />}
        </div>

        <div className="right-form">
          {!role ? (
            <div className="step-content">
              <h1>Who are you?</h1>
              <button className="btn" onClick={() => setRole("doctor")}>
                Doctors
              </button>
              <button className="btn" onClick={() => setRole("pathologist")}>
                Pathologists
              </button>
              <button className="btn" onClick={() => setRole("patient")}>
                Patient
              </button>
              <button
                className="btn"
                onClick={() => navigate("/login", { replace: true })}
              >
                Already Registered? Sign in
              </button>
            </div>
          ) : (
            <div className="form-content">
              {renderFormFields()}
              <div className="form-buttons">
                <button onClick={() => setRole(null)}>⬅ Change Role</button>
                <button onClick={handleSubmit}>✅ Submit</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
