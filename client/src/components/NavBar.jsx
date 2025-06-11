import React from "react";
import "../css/NavBar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <div>🩺</div> Medico Hub
        </div>
        <div className="navs">
          <div className="nav-links">
            <button>Home</button>
            <button>Rooms</button>
            <button>Reports</button>
          </div>
          <div className="rightfx">
            <div>
              <input type="text" placeholder="Search here" />
            </div>

            <button
              className="login-btn"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              Login/Register
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
