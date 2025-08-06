import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useEventDetails from "../hooks/useEventDetails";
import usePerformer from "../hooks/usePerformer";

const DogadjajDetalji = ({ userData }) => {
  const { id } = useParams();
  const token    = userData?.token || sessionStorage.getItem("userToken");
  const navigate = useNavigate();

  // Event & performer hooks
  const {
    event,
    performerId,
    loading: eventLoading,
    error: eventError
  } = useEventDetails(id, token);
  const {
    performer,
    loading: performerLoading,
    error: performerError
  } = usePerformer(performerId, token);

  // Reservation modal state
  const [modalOpen, setModalOpen]   = useState(false);
  const [form, setForm]             = useState({
    datum: "",
    broj_karata: 1,
    tip_karti: "regularna",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);

  // Reviews state
  const [reviews, setReviews]       = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [errorReviews, setErrorReviews]     = useState(null);

  // Fetch reviews for this event
  useEffect(() => {
    if (!token) return;
    setLoadingReviews(true);
    fetch(`http://127.0.0.1:8000/api/dogadjaji/${id}/recenzije`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept:        "application/json",
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Greška pri učitavanju recenzija.");
        return res.json();
      })
      .then(json => setReviews(json.data || json))
      .catch(err => setErrorReviews(err.message))
      .finally(() => setLoadingReviews(false));
  }, [id, token]);

  if (eventLoading) return <p style={{ padding: "20px" }}>Učitavanje detalja događaja...</p>;
  if (eventError)   return <p style={{ padding: "20px" }}>Greška pri učitavanju događaja.</p>;

  function openModal() {
    setError(null);
    setForm({ datum: "", broj_karata: 1, tip_karti: "regularna" });
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/rezervacije", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept":       "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          status: "neplaceno",
          dogadjaj_id: id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Greška pri kreiranju.");
      alert("Rezervacija uspešno kreirana!");
      closeModal();
      navigate("/moje-rezervacije");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  return (
    <div className="dogadjaj-detalji-container" style={{ paddingTop: "600px", marginTop: "200px" }}>
      <div style={{ paddingBottom: "10px" }}>
        <Link style={{ color: "#FF7043", fontWeight: "bold" }} to="/pocetna">Početna</Link> &gt;{" "}
        <Link style={{ color: "#FF7043", fontWeight: "bold" }} to="/dogadjaji">Dogadjaji</Link> &gt;{" "}
        <span style={{ fontWeight: "bold" }}>Detalji događaja</span>
      </div>

      <div className="dogadjaj-main">
        <div className="dogadjaj-left">
          <img
            src={event.link_slike || "/assets/default.jpg"}
            alt="Slika događaja"
            className="dogadjaj-slika"
          />
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

        <div className="izvodjac-right">
          <img
            src={performer?.link_slike || "/assets/default-performer.jpg"}
            alt="Slika izvođača"
            className="izvodjac-slika"
            style={{ width:"200px", height:"auto"}}
          />
          {performerLoading ? (
            <p style={{ marginTop: "20px" }}>Učitavanje izvođača...</p>
          ) : performerError ? (
            <p style={{ marginTop: "20px" }}>Greška pri učitavanju izvođača.</p>
          ) : (
            <div className="izvodjac-info">
              <h2>Izvođač</h2>
              <p><strong>Ime:</strong> {performer.ime}</p>
              <p><strong>Žanr:</strong> {performer.zanr}</p>
              <p><strong>Biografija:</strong> {performer.biografija}</p>
            </div>
          )}
        </div>
      </div>

      <div className="recenzije-box">
        <h3>Recenzije korisnika</h3>
        {loadingReviews && <p>Učitavanje recenzija…</p>}
        {errorReviews && <p>{errorReviews}</p>}
        {!loadingReviews && !errorReviews && reviews.length === 0 && (
          <p>Nema recenzija za ovaj događaj.</p>
        )}
        {!loadingReviews && !errorReviews && reviews.map(r => (
          <div key={r.id} className="recenzija-item">
            <p>
              <strong>{r.korisnik?.name || "Anonimni"}</strong>: {r.recenzija}
            </p>
          </div>
        ))}
      </div>

      <div className="dogadjaj-actions">
        <button className="action-btn rezervisi" onClick={openModal}>
          Rezerviši događaj
        </button>
        <button className="action-btn izmeni" onClick={() => navigate(-1)}>
          Nazad na događaje
        </button>
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Nova rezervacija</h2>
            {error && <p className="modal-error">{error}</p>}
            <form onSubmit={handleSubmit} className="modal-form">
              <label>
                Datum rezervacije:
                <input
                  type="date"
                  name="datum"
                  value={form.datum}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Broj karata:
                <input
                  type="number"
                  name="broj_karata"
                  min="1"
                  value={form.broj_karata}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Tip karte:
                <select
                  name="tip_karti"
                  value={form.tip_karti}
                  onChange={handleChange}
                >
                  <option value="regularna">Regularna</option>
                  <option value="vip">VIP</option>
                  <option value="gold">GOLD</option>
                </select>
              </label>
              <input type="hidden" name="status" value="neplaceno" />
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Otkaži
                </button>
                <button
                  type="submit"
                  className="modal-submit"
                  disabled={submitting}
                >
                  {submitting ? "Bežiči…" : "Potvrdi rezervaciju"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DogadjajDetalji;
