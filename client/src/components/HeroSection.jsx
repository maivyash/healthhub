import React, { useEffect, useState } from "react";
import "../css/HeroSectionHomePatient.css";
import doctorsImage from "../asset/doctors.png";
import supportImage from "../asset/support.jpg";
import graphImage from "../asset/graph.jpg";
import aiImage from "../asset/AI.jpg";
import { useAuth } from "../components/AuthAutorization";

const HeroSection = () => {
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
            <h1>Your Health in Your</h1>
            <h1 className="fingertips">Fingertips</h1>
            <div className="features">
              <div className="card">
                <br />
                book doctors
                <br />
                consultation online
                <br />
                <img src={supportImage} alt="support" srcset="" />
                <br />
                <button>Know More ➡️</button>
              </div>
              <div className="card">
                <br />
                medical history
                <br />
                records
                <br />
                <img src={graphImage} alt="support" srcset="" />
                <br />
                <button>Know More ➡️</button>
              </div>
              <div className="card">
                <br />
                AI powered
                <br />
                personal assistance
                <br />
                <img src={aiImage} alt="support" srcset="" />
                <br />
                <button>Know More ➡️</button>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img src={doctorsImage} alt="Doctors" />
          </div>
        </div>

        <div className="weProvide" s>
          <h1>We Provide</h1>
          {localUser.role === "doctor" ? (
            <div className="features">
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
                <button>View Now</button>
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

                <button>View Now</button>
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

                <button>View Now</button>
              </div>
            </div>
          ) : localUser.role === "pathologist" ? (
            <div className="features">
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
            <div className="features">
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
                <button>Book Now</button>
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

                <button>Book Now</button>
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

                <button>Book Now</button>
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

                <button>Create Now</button>
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

                <button>Create Plan</button>
              </div>
            </div>
          )}
        </div>
        <div>
          <div id="Email_contact">
            <div class="row">
              <p>Made with ❤️ By Yash Gupta</p>
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
