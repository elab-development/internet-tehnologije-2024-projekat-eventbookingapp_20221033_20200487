import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Prijava from "./pages/Prijava";
import Registracija from "./pages/Registracija";
import Pocetna from "./pages/Pocetna";
import Dogadjaji from "./pages/Dogadjaji";
import DogadjajDetalji from "./pages/DogadjajDetalji"; 
import Izvodjaci from "./pages/Izvodjaci"; 
import NavigacioniMeni from "./components/NavigacioniMeni";
import Futer from "./components/Futer";

function App() {
  const [userData, setUserData] = useState({
    id: null,
    app_employee: null,
    name: null,
    token: null,
  });

  useEffect(() => {
    const storedId = sessionStorage.getItem("userId");
    const storedAppEmployee = sessionStorage.getItem("app_employee");
    const storedName = sessionStorage.getItem("userName");
    const storedToken = sessionStorage.getItem("userToken");

    if (storedId && storedAppEmployee !== null && storedToken && storedName) {
      setUserData({
        id: storedId,
        app_employee: parseInt(storedAppEmployee, 10),
        name: storedName,
        token: storedToken,
      });
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setUserData({ id: null, app_employee: null, name: null, token: null });
  };

  return (
    <Router>
      {userData.token && <NavigacioniMeni userData={userData} handleLogout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={userData.token ? <Navigate to="/pocetna" replace /> : <Prijava setUserData={setUserData} userData={userData} />}
        />
        <Route path="/registracija" element={<Registracija />} />
        <Route
          path="/pocetna"
          element={userData.token && userData.app_employee === 0 ? <Pocetna /> : <Navigate to="/" replace />}
        />
        <Route
          path="/dogadjaji"
          element={userData.token && userData.app_employee === 0 ? <Dogadjaji userData={userData} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/dogadjaj/:id"
          element={userData.token && userData.app_employee === 0 ? <DogadjajDetalji userData={userData} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/izvodjaci"
          element={userData.token && userData.app_employee === 0 ? <Izvodjaci userData={userData} /> : <Navigate to="/" replace />}
        />
      </Routes>
      {userData.token && <Futer />}
    </Router>
  );
}

export default App;
