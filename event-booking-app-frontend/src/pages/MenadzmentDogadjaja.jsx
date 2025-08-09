// src/pages/MenadzmentDogadjaja.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Kartica from "../components/Kartica";
import Button from "../components/Button";
import usePerformers from "../hooks/usePerformers";

const MenadzmentDogadjaja = ({ userData }) => {
  const token = userData?.token || sessionStorage.getItem("userToken");
  const navigate = useNavigate();

  // events state & pagination
  const [events, setEvents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [page, setPage]           = useState(1);
  const perPage = 9;

  // performers for select
  const { performers, loading: perfLoading } = usePerformers(token);

  // modal/form state
  const [modalOpen, setModalOpen]   = useState(false);
  const [form, setForm]             = useState({
    naziv: "",
    datum: "",
    lokacija: "",
    tip_dogadjaja: "koncert",
    opis: "",
    cena: 0,
    izvodjac_id: "",
    link_slike: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // fetch all events
  const fetchEvents = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/dogadjaji", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
    })
      .then(res => {
        if (!res.ok) throw new Error("Greška pri učitavanju događaja.");
        return res.json();
      })
      .then(json => setEvents(json.data || json))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(fetchEvents, [token]);

  // pagination logic
  const totalPages = Math.ceil(events.length / perPage);
  const paginated = events.slice((page-1)*perPage, page*perPage);

  function openModal() {
    setForm({
      naziv: "",
      datum: "",
      lokacija: "",
      tip_dogadjaja: "koncert",
      opis: "",
      cena: 0,
      izvodjac_id: performers?.[0]?.id || "",
      link_slike: ""
    });
    setSubmitError(null);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/dogadjaji", {
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          "Accept":"application/json",
          Authorization:`Bearer ${token}`
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Greška pri kreiranju događaja.");
      closeModal();
      fetchEvents();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="md-loading">Učitavanje...</p>;
  if (error)   return <p className="md-error">{error}</p>;

  return (
    <div className="md-page" style={{marginTop:"1200px"}}>
      <div>
        <Link style={{color:"#FF7043", fontWeight:"bold"}} to="/dashboard">Dashboard</Link> &gt; 
        <span style={{fontWeight:"bold"}}>Menadzment Dogadjaja</span>
      </div>
      <div className="md-header">
        <h1>Menadžment Događaja</h1>
        <Button text="Novi događaj" onClick={openModal} />
      </div>

      <div className="md-grid">
        {paginated.map(evt => (
          <Kartica
            key={evt.id}
            imageUrl={evt.link_slike || "/assets/default.jpg"}
            name={evt.naziv}
            location={evt.lokacija}
            type={evt.tip_dogadjaja}
            price={evt.cena}
            show={false}
          />
        ))}
      </div>

      <div className="md-pagination">
        <Button
          text="Prethodna"
          onClick={() => setPage(p => Math.max(p-1, 1))}
          disabled={page===1}
        />
        <span>Strana {page} od {totalPages}</span>
        <Button
          text="Sledeća"
          onClick={() => setPage(p => Math.min(p+1, totalPages))}
          disabled={page===totalPages}
        />
      </div>

      {modalOpen && (
        <div className="md-modal-overlay" onClick={closeModal}>
          <div className="md-modal" onClick={e=>e.stopPropagation()}>
            <h2>Novi događaj</h2>
            {submitError && <p className="md-submit-error">{submitError}</p>}
            <form onSubmit={handleSubmit} className="md-form">
              <label> Naziv:
                <input name="naziv" value={form.naziv} onChange={handleChange} required />
              </label>
              <label> Datum:
                <input type="date" name="datum" value={form.datum} onChange={handleChange} required />
              </label>
              <label> Lokacija:
                <input name="lokacija" value={form.lokacija} onChange={handleChange} required />
              </label>
              <label> Tip:
                <select name="tip_dogadjaja" value={form.tip_dogadjaja} onChange={handleChange}>
                  <option value="koncert">Koncert</option>
                  <option value="festival">Festival</option>
                  <option value="predstava">Predstava</option>
                  <option value="konferencija">Konferencija</option>
                  <option value="izlozba">Izložba</option>
                </select>
              </label>
              <label> Opis:
                <textarea name="opis" value={form.opis} onChange={handleChange} />
              </label>
              <label> Cena:
                <input type="number" name="cena" value={form.cena} onChange={handleChange} min="0" required />
              </label>
              <label> Izvođač:
                {perfLoading
                  ? <p>Učitavanje izvođača…</p>
                  : (
                    <select name="izvodjac_id" value={form.izvodjac_id} onChange={handleChange} required>
                      {performers.map(p=>(
                        <option key={p.id} value={p.id}>{p.ime}</option>
                      ))}
                    </select>
                  )
                }
              </label>
              <label> Link slike:
                <input name="link_slike" value={form.link_slike} onChange={handleChange} />
              </label>
              <div className="md-form-actions">
                <Button text="Otkaži" onClick={closeModal} disabled={submitting} />
                <Button text={submitting?"..." : "Sačuvaj"} type="submit" disabled={submitting} />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenadzmentDogadjaja;
