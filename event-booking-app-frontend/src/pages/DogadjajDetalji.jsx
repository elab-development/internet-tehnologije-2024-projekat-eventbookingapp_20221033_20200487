import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DogadjajDetalji = ({ userData }) => {
  const { id } = useParams();
  const token = userData?.token || sessionStorage.getItem("userToken");
  const navigate = useNavigate();
  // Stanje za dogadjaj i izvođača
  const [dogadjaj, setDogadjaj] = useState(null);
  const [izvodjac, setIzvodjac] = useState(null);

  // Stanje za slike (sa Pexels-a)
  const [imageUrlDogadjaj, setImageUrlDogadjaj] = useState("/assets/default.jpg");
  const [imageUrlIzvodjac, setImageUrlIzvodjac] = useState("/assets/default.jpg");

  // Fetch dogadjaj
  useEffect(() => {
    if (token) {
      axios
        .get(`http://127.0.0.1:8000/api/dogadjaji/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setDogadjaj(res.data.data);
          // Nakon što dobijemo dogadjaj, dohvatamo izvođača
          if (res.data.data.izvodjac) {
            fetchIzvodjac(res.data.data.izvodjac.id);
          }
        })
        .catch((err) => console.error("Greška pri dohvaćanju detalja događaja:", err));
    }
  }, [id, token]);

  // Fetch izvođac
  const fetchIzvodjac = (izvodjacId) => {
    axios
      .get(`http://127.0.0.1:8000/api/izvodjaci/${izvodjacId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setIzvodjac(res.data.data);
      })
      .catch((err) => console.error("Greška pri dohvaćanju izvođača:", err));
  };

  // Fetch random slike sa Pexels-a za dogadjaj i izvođača
  useEffect(() => {
    const API_KEY = process.env.REACT_APP_PEXELS_API_KEY;
    if (API_KEY) {
      // 1. Slika za dogadjaj
      axios
        .get("https://api.pexels.com/v1/search", {
          headers: { Authorization: API_KEY },
          params: { query: "event", per_page: 20 },
        })
        .then((res) => {
          if (res.data && Array.isArray(res.data.photos) && res.data.photos.length > 0) {
            const randomIndex = Math.floor(Math.random() * res.data.photos.length);
            setImageUrlDogadjaj(res.data.photos[randomIndex].src.medium);
          }
        })
        .catch((err) => console.error("Greška pri dohvaćanju slike dogadjaja:", err));

      // 2. Slika za izvođača
      axios
        .get("https://api.pexels.com/v1/search", {
          headers: { Authorization: API_KEY },
          params: { query: "person portrait", per_page: 20 },
        })
        .then((res) => {
          if (res.data && Array.isArray(res.data.photos) && res.data.photos.length > 0) {
            const randomIndex = Math.floor(Math.random() * res.data.photos.length);
            setImageUrlIzvodjac(res.data.photos[randomIndex].src.medium);
          }
        })
        .catch((err) => console.error("Greška pri dohvaćanju slike izvođača:", err));
    }
  }, [id]);

  if (!dogadjaj) {
    return <p style={{ padding: "20px" }}>Učitavanje detalja događaja...</p>;
  }

  return (
    <div className="dogadjaj-detalji-container" style={{paddingTop:"600px"}}>
      <div className="dogadjaj-main">
        {/* Leva strana: Slika dogadjaja + Info */}
        <div className="dogadjaj-left">
          <div className="dogadjaj-slika">
            <img src={imageUrlDogadjaj} alt="Slika dogadjaja" />
          </div>
          <div className="dogadjaj-info-box">
            <h2>Info o događaju</h2>
            <p><strong>Naziv:</strong> {dogadjaj.naziv}</p>
            <p><strong>Datum:</strong> {dogadjaj.datum}</p>
            <p><strong>Lokacija:</strong> {dogadjaj.lokacija}</p>
            <p><strong>Tip:</strong> {dogadjaj.tip_dogadjaja}</p>
            <p><strong>Opis:</strong> {dogadjaj.opis}</p>
            <p><strong>Cena:</strong> {dogadjaj.cena} RSD</p>
          </div>
        </div>

        {/* Desna strana: Slika izvođača + Info */}
        <div className="izvodjac-right">
          <div className="izvodjac-slika">
            <img src={imageUrlIzvodjac} alt="Slika izvođača" />
          </div>
          {izvodjac ? (
            <div className="izvodjac-info">
              <h2>Izvođač</h2>
              <p><strong>Ime:</strong> {izvodjac.ime}</p>
              <p><strong>Žanr:</strong> {izvodjac.zanr}</p>
              <p><strong>Biografija:</strong> {izvodjac.biografija}</p>
              <button className="kontakt-btn"  onClick={() => alert("IMPLEMENTIRACE SE ZA PROJEKAT")}>Kontaktiraj izvođača</button>
            </div>
          ) : (
            <p style={{ marginTop: "20px" }}>Učitavanje izvođača...</p>
          )}
        </div>
      </div>

      {/* Dugmad ispod */}
      <div className="dogadjaj-actions">
        <button className="action-btn rezervisi" onClick={() => alert("IMPLEMENTIRACE SE ZA PROJEKAT")}>Rezerviši događaj</button>
        <button className="action-btn izmeni" onClick={() => navigate(-1)}>Nazad na pregled svih dogadjaja</button>
      </div>
    </div>
  );
};

export default DogadjajDetalji;
