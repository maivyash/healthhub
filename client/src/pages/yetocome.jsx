import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { gsap } from "gsap";
import "react-toastify/dist/ReactToastify.css";
import "../css/yettocome.css";
import comingSoonImage from "../asset/commingsoon.png"; // Update path
import Navbar from "../components/NavBar";

const ComingSoon = () => {
  const containerRef = useRef();
  const [email, setEmail] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  const handleSubscribe = () => {
    if (!email.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }

    toast.success("Subscribed successfully!");
    setEmail("");
  };

  return (
    <>
      <Navbar />
      <div className={`coming-soon-wrapper ${darkMode ? "dark" : ""}`}>
        <div className="toggle-mode">
          <label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            Dark Mode
          </label>
        </div>

        <div ref={containerRef} className="coming-soon-container">
          <img
            src={comingSoonImage}
            alt="Coming Soon Illustration"
            className="coming-soon-image"
          />
          <h2 className="coming-soon-title">Coming Soon!</h2>
          <p className="coming-soon-text">
            We're working hard to bring you this feature. Stay tuned for
            updates!
          </p>

          <div className="email-subscription">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSubscribe}>Subscribe for Updates</button>
          </div>
        </div>

        <ToastContainer position="bottom-center" />
      </div>
    </>
  );
};

export default ComingSoon;
