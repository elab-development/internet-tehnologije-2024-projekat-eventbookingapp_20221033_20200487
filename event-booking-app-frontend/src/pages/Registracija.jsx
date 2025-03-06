import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Registracija = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

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
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Došlo je do greške pri registraciji.");
      }

      alert("Registracija uspešna! Preusmeravamo vas na login stranicu.");
      navigate("/");
    } catch (error) {
      console.log("Greška u registraciji:", error);
      setError(error.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-title">
        <img src="/assets/logo.png" alt="EasyBook Logo" className="logo" />
        <h1>EasyBook</h1>
      </div>
      <p>Kreirajte nalog i rezervišite događaje jednostavno i brzo.</p>

      <div className="register-container">
        <h2>Registracija</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Ime</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Lozinka</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>

          <Button text="Registruj se" type="submit" />
        </form>

        <p className="login-text">Već imate nalog? Prijavite se klikom na dugme ispod:</p>
        <Button text="Nazad na prijavu" onClick={() => navigate("/")} />
      </div>
    </div>
  );
};

export default Registracija;
