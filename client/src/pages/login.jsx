import React, { useRef, useState, useEffect } from "react";
import { replace, useNavigate } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../components/AuthAutorization";

// after successful login:

import "../css/loginpage.css";

const LoginPage = () => {
  const { user, setUser } = useAuth();
  const [role, setRole] = useState("doctor");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const inputRefs = useRef({});
  const imageRef = useRef(null);
  const formRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  useEffect(() => {
    const firstErrorKey = Object.keys(formErrors)[0];
    if (firstErrorKey && inputRefs.current[firstErrorKey]) {
      inputRefs.current[firstErrorKey].focus();
    }
  }, [formErrors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      toast.error("Email is required");
      inputRefs.current.email?.focus();
      return false;
    } else if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      inputRefs.current.email?.focus();
      return false;
    }

    if (!formData.password) {
      toast.error("Password is required");
      inputRefs.current.password?.focus();
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix errors");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, ...formData }),
      });

      const result = await response.json();
      switch (response.status) {
        case 200:
          console.log(role);
          console.log(result.role);

          if (!(role === result.role)) {
            toast.error("User is not a " + role);
            return;
          }
          toast.success(result.message || "Login successful");
          setUser(result.user);
          document.cookie = `token=${result.token}; path=/; max-age=3600`;
          document.cookie = `role=${result.role}; path=/; max-age=3600`;

          navigate("/", { replace: true }, 1000);
          break;

        case 400:
          toast.error("Please fill in all fields");
          break;

        case 403:
          toast.error("Invalid role selected");
          break;

        case 404:
          toast.warning("User not found");
          break;

        case 401:
          toast.error("Incorrect password");
          break;

        default:
          toast.error(result.message || "Unexpected error occurred");
          break;
      }
    } catch (err) {
      toast.error("Server not reachable");
      console.error(err);
    }
  };

  const renderForm = () => (
    <form className="form-container" onSubmit={handleLogin}>
      <input
        type="text"
        name="email"
        placeholder={`${role.charAt(0).toUpperCase() + role.slice(1)} Email`}
        className="input-field"
        value={formData.email}
        onChange={handleChange}
        ref={(el) => (inputRefs.current.email = el)}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        className="input-field"
        value={formData.password}
        onChange={handleChange}
        ref={(el) => (inputRefs.current.password = el)}
      />

      <button type="submit" className={`submit-button ${role}`}>
        Sign In
      </button>
    </form>
  );

  const getImageSrc = () => {
    switch (role) {
      case "doctor":
        return "/loginpage/doctors.png";
      case "patient":
        return "/loginpage/patients.png";
      case "pathologist":
        return "/loginpage/pathologist.png";
      default:
        return "/loginpage/doctors.png";
    }
  };

  return (
    <div className="bc-image">
      <div className="login-page">
        <div className="login-container">
          <div className="logo-section">
            <SwitchTransition mode="out-in">
              <CSSTransition
                key={role}
                timeout={300}
                classNames="fade"
                unmountOnExit
                nodeRef={imageRef}
              >
                <img
                  ref={imageRef}
                  src={getImageSrc()}
                  alt="medical logo"
                  className="logo-image"
                />
              </CSSTransition>
            </SwitchTransition>
          </div>

          <div className="form-section">
            <div className="form-box">
              <SwitchTransition mode="out-in">
                <CSSTransition
                  key={role}
                  timeout={300}
                  classNames="fade"
                  unmountOnExit
                  nodeRef={formRef}
                >
                  <div ref={formRef}>{renderForm()}</div>
                </CSSTransition>
              </SwitchTransition>
            </div>

            <div className="role-buttons">
              <button onClick={() => setRole("doctor")}>Doctor's</button>
              <button onClick={() => setRole("patient")}>Patient</button>
              <button onClick={() => setRole("pathologist")}>
                Pathologist
              </button>
            </div>

            <div className="register-btn">
              <button onClick={() => navigate("/register")}>
                New here? Register!!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
