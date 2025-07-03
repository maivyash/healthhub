import React, { useEffect, useState } from "react";

import doctorsImage from "../asset/doctors.png";
import { useNavigate } from "react-router-dom";
import supportImage from "../asset/support.jpg";
import graphImage from "../asset/graph.jpg";
import aiImage from "../asset/AI.jpg";
import { useAuth } from "../components/AuthAutorization";
import SplitText from "../tools/SplitText";
import PixelCard from "../tools/card";
const isMobile = window.innerWidth <= 768;
if (isMobile) {
  import("../css/HeroSectionHomePatient.mobile.css");
} else {
  import("../css/HeroSectionHomePatient.css");
}
const HeroSection = () => {
  const navigate = useNavigate();
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };
  function handleNavigate() {}
  const { user, loading } = useAuth();
  const [localUser, setLocalUser] = useState({});
  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      return;
    }
    console.log(user);

    if (!user.role) {
      return;
    }
    setLocalUser(user);
  }, [loading, user, setLocalUser]);
  return (
    <div className="bcimage">
      <div className="hero-section">
        <div className="hero-content">
          <div>
            <h1 className="Health">
              <SplitText
                text="Your Health in Your!"
                className="text-2xl font-semibold text-center"
                delay={100}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
                onLetterAnimationComplete={handleAnimationComplete}
              />
            </h1>
            <h1 className="fingertips">
              <SplitText
                text="FingerTips!"
                className="text-2xl font-semibold text-center"
                delay={100}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
                onLetterAnimationComplete={handleAnimationComplete}
              />
            </h1>
            <div className="features">
              <div className="card">
                <br />
                book doctors
                <br />
                consultation online
                <br />
                <img src={supportImage} alt="support" srcset="" />
                <br />
                <button
                  onClick={() => {
                    navigate("/knowconsultaion");
                  }}
                >
                  Know More ➡️
                </button>
              </div>
              <div className="card">
                <br />
                medical history
                <br />
                records
                <br />
                <img src={graphImage} alt="support" srcset="" />
                <br />
                <button
                  onClick={() => {
                    navigate("/knowhistory");
                  }}
                >
                  Know More ➡️
                </button>
              </div>
              <div className="card">
                <br />
                AI powered
                <br />
                personal assistance
                <br />
                <img src={aiImage} alt="support" srcset="" />
                <br />
                <button
                  onClick={() => {
                    navigate("knowai");
                  }}
                >
                  Know More ➡️
                </button>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src={doctorsImage} alt="Doctors" />
          </div>
        </div>

        <div className="weProvide" s>
          <SplitText
            text="WE PROVIDE!"
            className="text-2xl font-semibold text-center"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={handleAnimationComplete}
          />
          {localUser.role === "doctor" ? (
            <div className="features fade-in">
              <div className="cardfx">
                <div>
                  🎥
                  <br />
                  View Online
                  <br />
                  consultation videochat
                  <br />
                  Requests
                  <br />
                </div>
                <button
                  onClick={() => {
                    navigate("/yetocome");
                  }}
                >
                  View Now
                </button>
              </div>
              <div className="cardfx">
                <div>
                  🏥
                  <br />
                  View offline medical
                  <br />
                  consultation
                  <br />
                </div>

                <button
                  onClick={() => {
                    navigate("/viewAppoitment");
                  }}
                >
                  View Now
                </button>
              </div>
              <div className="cardfx">
                <div>
                  🏡
                  <br />
                  View doorstep medical
                  <br />
                  checkup
                  <br />
                </div>

                <button
                  onClick={() => {
                    navigate("/yetocome");
                  }}
                >
                  View Now
                </button>
              </div>
            </div>
          ) : localUser.role === "pathologist" ? (
            <div className="features fade-in">
              <div className="cardfx">
                <div>
                  🏡
                  <br />
                  book doorstep medical
                  <br />
                  checkup
                  <br />
                </div>

                <button>Create Plan</button>
              </div>
            </div>
          ) : (
            <div className="features fade-in">
              <div className="cardfx">
                <div>
                  🎥
                  <br />
                  book doctors
                  <br />
                  x consultation videochat
                  <br />
                  online
                  <br />
                </div>
                <button
                  onClick={() => {
                    navigate("/yetocome");
                  }}
                >
                  Book Now
                </button>
              </div>
              <div className="cardfx">
                <div>
                  🏥
                  <br />
                  book offline medical
                  <br />
                  consultation
                  <br />
                </div>

                <button
                  onClick={() => {
                    navigate("/findDoctor");
                  }}
                >
                  Book Now
                </button>
              </div>
              <div className="cardfx">
                <div>
                  🏡
                  <br />
                  book doorstep medical
                  <br />
                  checkup
                  <br />
                </div>

                <button
                  onClick={() => {
                    navigate("/yetocome");
                  }}
                >
                  Book Now
                </button>
              </div>

              <div className="cardfx">
                <div>
                  🏪
                  <br /> Rooms for any
                  <br />
                  specific health issue
                  <br />
                  personal assistance
                  <br />
                </div>

                <button
                  onClick={() => {
                    navigate("/rooms");
                  }}
                >
                  Create Now
                </button>
              </div>
              <div className="cardfx">
                <div>
                  🏡
                  <br />
                  book doorstep medical
                  <br />
                  checkup
                  <br />
                </div>

                <button
                  onClick={() => {
                    navigate("/yetocome");
                  }}
                >
                  Create Plan
                </button>
              </div>
            </div>
          )}
        </div>
        <div>
          <div id="Email_contact">
            <div class="row">
              <SplitText
                text="Made with ❤️ By Yash Gupta!"
                className="text-2xl font-semibold text-center"
                delay={100}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
                onLetterAnimationComplete={handleAnimationComplete}
              />
            </div>
            <div class="row">
              <span>📧</span>
              <p>Email :</p>
              <p className="email">guptayash2005.yg@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
