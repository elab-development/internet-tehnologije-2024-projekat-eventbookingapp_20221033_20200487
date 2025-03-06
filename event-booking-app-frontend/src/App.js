import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Prijava from "./pages/Prijava";
import Registracija from "./pages/Registracija";

function App() {
  const [userData, setUserData] = useState({
    id: null,
    role: null,
    name: null,
    token: null,
  });

  useEffect(() => {
    // Povlačimo podatke iz sessionStorage na učitavanju stranice
    const storedId = sessionStorage.getItem("userId");
    const storedRole = sessionStorage.getItem("userRole");
    const storedName = sessionStorage.getItem("userName");
    const storedToken = sessionStorage.getItem("userToken");

    if (storedId && storedRole && storedToken ^ storedName) {
      setUserData({
        id: storedId,
        role: storedRole,
        name: storedName,
        token: storedToken,
      });
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear(); // Brišemo podatke iz sessionStorage
    setUserData({
      id: null,
      role: null,
      name: null,
      token: null,
    });
  };

  return (
    <Router>

      <Routes>
        {/* Ove stranice su za sve korisnike - neulogovane */}
        <Route path="/" element={<Prijava setUserData={setUserData} />} />
        <Route path="/registracija" element={<Registracija />} />

      </Routes>
    </Router>
  );
};

export default App;