// src/components/Navbar.js
import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ token, setToken }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <NavLink className="navbar-brand" to="/">
        <span>INSY7314</span>
      </NavLink>
      <div className="navbar" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          {token ? (
            <>
  
              <li className="nav-item">
                <NavLink className="nav-link" to="/create-payment">
                  Make Payment
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/payments-list">
                  Payments List
                </NavLink>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/register">
                  Register
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
