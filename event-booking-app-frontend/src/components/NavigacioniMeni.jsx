import React from "react";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { Tooltip } from "react-tooltip";

const NavigacioniMeni = ({ userData, handleLogout }) => {

  return (
    <nav className="nav-bar">
      {/* Leva strana */}
      <div className="nav-left">
        <Link to="/pocetna" className="nav-link">
          Početna
        </Link>
        <Link to="/dogadjaji" className="nav-link">
          Događaji
        </Link>
        <Link to="/izvodjaci" className="nav-link">
          Izvođači
        </Link>
      </div>

      {/* Sredina - Logo */}
      <div className="nav-center">
        <img src="/assets/logo.png" alt="EasyBook Logo" className="nav-logo" />
        <h1 className="nav-title">EasyBook</h1>
      </div>

      {/* Desna strana */}
      <div className="nav-right">
        <span className="user-info">
         Trenutno prijavljen/a: <span style={{color:"#f89c1c"}}>{userData.name}</span>
        </span>
        <button className="logout-btn" onClick={handleLogout} data-tooltip-id="tooltip" data-tooltip-content="Odjava">
          <FiLogOut size={22} />
        </button>
      </div>

      {/* Tooltip Provider */}
      <Tooltip id="tooltip" place="bottom" style={{ backgroundColor: "black", color: "white", borderRadius: "5px", padding: "5px" }} />
    </nav>
  );
};

export default NavigacioniMeni;
