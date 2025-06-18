import { useState, useEffect } from "react";
import "../css/NavBar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthAutorization";
const JWTsecretKey = "eknumbertujhikambarchallshekasheki";

const Navbar = () => {
  const { user } = useAuth();
  const [name, setName] = useState("Login/Register"); // Initially empty
  const navigate = useNavigate();

  // Helper to get cookie by name
  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

  // Check login and update state

  // Run checkLoggedIn once on component mount

  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <div>🩺</div> Medico Hub
        </div>

        <div className="navs">
          <div className="nav-links">
            <button
              onClick={() => {
                navigate("/");
              }}
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate("/rooms");
              }}
            >
              Rooms
            </button>
            <button
              onClick={() => {
                navigate("/reports");
              }}
            >
              Reports
            </button>
          </div>

          <div className="rightfx">
            <div>
              <input type="text" placeholder="Search here" />
            </div>

            {user ? (
              <button
                className="login-btn"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
              </button>
            ) : (
              <button
                className="login-btn"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                Login/Register
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
