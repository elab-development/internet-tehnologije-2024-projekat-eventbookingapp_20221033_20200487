import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Prijava from "./pages/Prijava";
import Registracija from "./pages/Registracija";
import Pocetna from "./pages/Pocetna";
import NavigacioniMeni from "./components/NavigacioniMeni";

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

    console.log("Provera sessionStorage:", { storedId, storedAppEmployee, storedToken });

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
       {userData.token && <NavigacioniMeni userData={userData} handleLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<Prijava setUserData={setUserData} userData={userData} />} />
        <Route path="/registracija" element={<Registracija />} />

        <Route
          path="/pocetna"
          element={
            userData.token && userData.app_employee === 0 ? (
              <Pocetna />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
