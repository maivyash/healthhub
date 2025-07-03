import { useState } from "react";
import "../css/NavBar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthAutorization";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          🩺 <span>Medico Hub</span>
        </div>

        <div className={`navs ${menuOpen ? "active" : ""}`}>
          <div className="nav-links">
            <button onClick={() => handleNavigate("/")}>Home</button>
            <button onClick={() => handleNavigate("/rooms")}>Rooms</button>
            <button onClick={() => handleNavigate("/reports")}>Reports</button>
          </div>

          <div className="rightfx">
            <input type="text" placeholder="Search here" />
            <button
              className="login-btn"
              onClick={() =>
                user ? handleNavigate("/profile") : handleNavigate("/login")
              }
            >
              {user
                ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
                : "Login/Register"}
            </button>
          </div>
        </div>

        <div className="hamburger" onClick={() => setMenuOpen((prev) => !prev)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
