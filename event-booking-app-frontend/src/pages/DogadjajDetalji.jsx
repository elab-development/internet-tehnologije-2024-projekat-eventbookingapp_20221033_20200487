import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useEventDetails from "../hooks/useEventDetails";
import usePerformer from "../hooks/usePerformer";
import useImage from "../hooks/useImage";

const DogadjajDetalji = ({ userData }) => {
  const { id } = useParams();
  const token = userData?.token || sessionStorage.getItem("userToken");
  const navigate = useNavigate();

  const { event, performerId, loading: eventLoading, error: eventError } = useEventDetails(id, token);
  const { performer, loading: performerLoading, error: performerError } = usePerformer(performerId, token);

  // Generate **new** images **every time** an event is clicked
  const eventImage = useImage(`concert event ${id}`);
  const performerImage = useImage(`musician profile ${performerId}`);

  if (eventLoading) return <p style={{ padding: "20px" }}>Učitavanje detalja događaja...</p>;
  if (eventError) return <p style={{ padding: "20px" }}>Greška pri učitavanju događaja.</p>;

  return (
    <div className="dogadjaj-detalji-container" style={{ paddingTop: "600px" }}>
        <div style={{paddingBottom:"10px"}}>
          <Link style={{color:"#FF7043", fontWeight:"bold"}} to="/pocetna">Početna</Link> &gt; <Link style={{color:"#FF7043", fontWeight:"bold"}} to="/dogadjaji">Dogadjaji</Link> &gt; <span style={{fontWeight:"bold"}}>Detalji dogadjaja</span>
        </div>
      <div className="dogadjaj-main">
        {/* Left Side: Event Image & Details */}
        <div className="dogadjaj-left">
          <div className="dogadjaj-slika">
            <img src={eventImage} alt="Slika dogadjaja" />
          </div>
          <div className="dogadjaj-info-box">
            <h2>Info o događaju</h2>
            <p><strong>Naziv:</strong> {event.naziv}</p>
            <p><strong>Datum:</strong> {event.datum}</p>
            <p><strong>Lokacija:</strong> {event.lokacija}</p>
            <p><strong>Tip:</strong> {event.tip_dogadjaja}</p>
            <p><strong>Opis:</strong> {event.opis}</p>
            <p><strong>Cena:</strong> {event.cena} RSD</p>
          </div>
        </div>

        {/* Right Side: Performer Image & Details */}
        <div className="izvodjac-right">
          <div className="izvodjac-slika">
            <img src={performerImage} alt="Slika izvođača" />
          </div>
          {performerLoading ? (
            <p style={{ marginTop: "20px" }}>Učitavanje izvođača...</p>
          ) : performerError ? (
            <p style={{ marginTop: "20px" }}>Greška pri učitavanju izvođača.</p>
          ) : (
            <div className="izvodjac-info">
              <h2>Izvođač</h2>
              <p><strong>Ime:</strong> {performer?.ime}</p>
              <p><strong>Žanr:</strong> {performer?.zanr}</p>
              <p><strong>Biografija:</strong> {performer?.biografija}</p>
              <button className="kontakt-btn" onClick={() => alert("IMPLEMENTIRACE SE ZA PROJEKAT")}>
                Kontaktiraj izvođača
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="dogadjaj-actions">
        <button className="action-btn rezervisi" onClick={() => alert("IMPLEMENTIRACE SE ZA PROJEKAT")}>
          Rezerviši događaj
        </button>
        <button className="action-btn izmeni" onClick={() => navigate(-1)}>
          Nazad na pregled svih događaja
        </button>
      </div>
    </div>
  );
};

export default DogadjajDetalji;
