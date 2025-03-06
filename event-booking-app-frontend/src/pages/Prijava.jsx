import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Prijava = ({ setUserData }) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Neuspešna prijava.");
      }

      const { id, role, name } = data.user;
      const { token } = data;

      sessionStorage.setItem("userId", id);
      sessionStorage.setItem("userRole", role);
      sessionStorage.setItem("userName", name);
      sessionStorage.setItem("userToken", token);

      setUserData({ id, role, name, token });

      alert("Uspešno ste prijavljeni!");

      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-title">
        <img src="/assets/logo.png" alt="EasyBook Logo" className="logo" />
        <h1>EasyBook</h1>
      </div>
      <p>Dobrodošli! Prijavite se i rezervišite događaje brzo i lako.</p>

      <div className="login-container">
        <h2>Prijava</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Lozinka</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <Button text="Prijavi se" type="submit" />
        </form>

        <p className="register-text">Nemate nalog? Registrujte se klikom na dugme ispod:</p>
        <Button text="Registracija" onClick={() => navigate("/registracija")} />
      </div>
    </div>
  );
};

export default Prijava;
