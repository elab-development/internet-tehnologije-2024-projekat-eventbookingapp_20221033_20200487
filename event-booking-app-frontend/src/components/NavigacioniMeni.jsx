// src/components/NavigacioniMeni.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import useImage from "../hooks/useImage";

const NavigacioniMeni = ({ userData, handleLogout }) => {
  const isAdmin = userData?.app_employee === 1;
  const avatarUrl = useImage("employee");

  return (
    <nav className="nav-bar">
      <div className="nav-left">
        {isAdmin ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/admin/dogadjaji" className="nav-link">Menadžment Događaja</Link>
            <Link to="/rezervacije" className="nav-link">Rezervacije</Link>
          </>
        ) : (
          <>
            <Link to="/pocetna" className="nav-link">Početna</Link>
            <Link to="/dogadjaji" className="nav-link">Događaji</Link>
            <Link to="/izvodjaci" className="nav-link">Izvođači</Link>
            <Link to="/moje-rezervacije" className="nav-link">Moje Rezervacije</Link>
          </>
        )}
      </div>

      <div className="nav-center">
        <img src="/assets/logo.png" alt="EasyBook Logo" className="nav-logo" />
        <h1 className="nav-title">EasyBook</h1>
      </div>

      <div className="nav-right">
        <img src={avatarUrl} alt="Avatar" className="nav-avatar" />
        <span className="user-info">
          Trenutno prijavljen/a: <span style={{ color: "#f89c1c" }}>{userData.name}</span>
        </span>
        <button className="logout-btn" onClick={handleLogout} data-tooltip-id="tooltip" data-tooltip-content="Odjava">
          <FiLogOut size={22} />
        </button>
      </div>

      <Tooltip id="tooltip" place="bottom" style={{ backgroundColor: "black", color: "white", borderRadius: "5px", padding: "5px" }} />
    </nav>
  );
};

export default NavigacioniMeni;
