import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "../css/loginpage.css";

const DoctorForm = () => (
  <form className="form-container">
    <input
      type="text"
      placeholder="Doctor ID or Email"
      className="input-field"
    />
    <input type="password" placeholder="Password" className="input-field" />
    <button className="submit-button doctor">Sign In</button>
  </form>
);

const PatientForm = () => (
  <form className="form-container">
    <input type="text" placeholder="Patient Email" className="input-field" />
    <input type="password" placeholder="Password" className="input-field" />
    <button className="submit-button patient">Sign In</button>
  </form>
);

const PathologistForm = () => (
  <form className="form-container">
    <input
      type="text"
      placeholder="Pathologist Email"
      className="input-field"
    />
    <input type="password" placeholder="Password" className="input-field" />
    <button className="submit-button pathologist">Sign In</button>
  </form>
);

const LoginPage = () => {
  const [role, setRole] = useState("doctor");
  const navigate = useNavigate();

  // Separate refs for image and form transitions
  const imageRef = useRef(null);
  const formRef = useRef(null);

  const renderForm = () => {
    switch (role) {
      case "doctor":
        return <DoctorForm />;
      case "patient":
        return <PatientForm />;
      case "pathologist":
        return <PathologistForm />;
      default:
        return null;
    }
  };

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
                nodeRef={imageRef} // separate ref here
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
                  nodeRef={formRef} // separate ref here
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
              <button
                onClick={() => {
                  navigate("/register");
                }}
              >
                new here?Register!!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
