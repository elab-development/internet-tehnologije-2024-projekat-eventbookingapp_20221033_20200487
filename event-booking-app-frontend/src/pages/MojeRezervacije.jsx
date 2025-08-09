import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const MojeRezervacije = ({ userData }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const navigate                    = useNavigate();
  const token                       = userData?.token || sessionStorage.getItem("userToken");

  // fetch user's reservations
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/rezervacije/moje", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then(res => {
        if (!res.ok) throw new Error("Greška pri učitavanju rezervacija.");
        return res.json();
      })
      .then(data => setReservations(data.data || data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovu rezervaciju?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/rezervacije/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Brisanje nije uspelo.");
      setReservations(reservations.filter(r => r.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // leave review handler
  const handleReview = async (id) => {
    const text = window.prompt("Unesite svoju recenziju (max 500 karaktera):");
    if (!text) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/rezervacije/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recenzija: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Greška pri ostavljanju recenzije.");
      // update that reservation's review in state
      setReservations(reservations.map(r =>
        r.id === id ? { ...r, recenzija: data.rezervacija.recenzija } : r
      ));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="mr-loading">Učitavanje rezervacija…</p>;
  if (error)   return <p className="mr-error">{error}</p>;

  if (reservations.length === 0) {
    return (
      <div className="mr-empty-state">
        <p>Nemate nijednu rezervaciju. Počnite da pravite rezervacije iz aktuelnih događaja!</p>
        <button className="mr-go-btn" onClick={() => navigate("/dogadjaji")} style={{width:"20%"}}>
          Pregledaj događaje
        </button>
      </div>
    );
  }

  return (
    <div className="mr-page">
      <div>
        <Link style={{color:"#FF7043", fontWeight:"bold"}} to="/pocetna">Početna</Link> &gt; 
        <span style={{fontWeight:"bold"}}>Moje Rezervacije</span>
      </div>
      <h1 className="mr-title">Moje Rezervacije</h1>
      <div className="mr-grid">
        {reservations.map(r => (
          <div key={r.id} className="mr-card">
            <h2 className="mr-card-title">{r.dogadjaj.naziv}</h2>
            <p><strong>Datum događaja:</strong> {r.dogadjaj.datum}</p>
            <p><strong>Datum rezervacije:</strong> {r.created_at}</p>
            <p><strong>Količina:</strong> {r.broj_karata}</p>
            <p><strong>Cena ukupno:</strong> {r.ukupna_cena} RSD</p>
            {r.recenzija && (
              <p className="mr-existing-review"><strong>Vaša recenzija:</strong> {r.recenzija}</p>
            )}
            <div className="mr-card-actions">
              <button
                className="mr-details-btn"
                onClick={() => navigate(`/dogadjaj/${r.dogadjaj.id}`)}
              >
                Pogledaj događaj
              </button>
              <button className="mr-delete-btn" onClick={() => handleDelete(r.id)}>
                Obriši rezervaciju
              </button>
              <button className="mr-review-btn" onClick={() => handleReview(r.id)}>
                Ostavi recenziju
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MojeRezervacije;
