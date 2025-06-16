import { useState, useEffect } from "react";
import "../css/NavBar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [role, setRole] = useState(""); // Initially empty
  const navigate = useNavigate();

  // Helper to get cookie by name
  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

  // Check login and update state
  function checkLoggedIn() {
    const token = getCookie("token");
    const userRole = getCookie("role");

    if (token && userRole) {
      setRole(userRole);
    } else {
      setRole(""); // Not logged in
    }
  }

  // Run checkLoggedIn once on component mount
  useEffect(() => {
    checkLoggedIn();
  }, []);

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

            {role ? (
              <button
                className="login-btn"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/about");
                }}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
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
