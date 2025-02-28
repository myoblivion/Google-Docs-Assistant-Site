// Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./../styles/Navbar.scss";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      {/* <div className="navbar-left">
        <Link to="/dashboard" className="nav-brand">
          Docs Assistant
        </Link>
      </div>
      
      <div className="navbar-right">
        {user ? (
          <button onClick={handleLogout} className="logout-button">
            <span className="material-icons">logout</span>
            Logout
          </button>
        ) : (
          <Link to="/" className="login-link">
            Login
          </Link>
        )}
      </div> */}
    </nav>
  );
};

export default Navbar;