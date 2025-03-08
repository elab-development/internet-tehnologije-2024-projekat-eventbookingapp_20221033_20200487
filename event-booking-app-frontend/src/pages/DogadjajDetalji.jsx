import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DogadjajDetalji = ({ userData }) => {
  const { id } = useParams();
  const token = userData?.token || sessionStorage.getItem("userToken");
  const [dogadjaj, setDogadjaj] = useState(null);

  useEffect(() => {
    if (token) {
      axios
        .get(`http://127.0.0.1:8000/api/dogadjaji/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setDogadjaj(res.data))
        .catch((err) => console.error("Greška pri dohvaćanju detalja događaja:", err));
    }
  }, [id, token]);

  if (!dogadjaj) {
    return <p>Učitavanje...</p>;
  }

  return (
    <div className="dogadjaj-detalji">
      <h1>{dogadjaj.naziv}</h1>
      <p><strong>Datum:</strong> {dogadjaj.datum}</p>
      <p><strong>Lokacija:</strong> {dogadjaj.lokacija}</p>
      <p><strong>Tip:</strong> {dogadjaj.tip_dogadjaja}</p>
      <p><strong>Opis:</strong> {dogadjaj.opis}</p>
      <p><strong>Cena:</strong> {dogadjaj.cena} RSD</p>
    </div>
  );
};

export default DogadjajDetalji;
