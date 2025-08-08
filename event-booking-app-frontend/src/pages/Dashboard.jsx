import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Button from "../components/Button";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Recharts
import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  CartesianGrid,
  XAxis, YAxis,
  Tooltip, Legend,
} from "recharts";

// NOVO: hook bez API ključa (Deezer charts)
import useTop5Izvodjaca from "../hooks/useTop5Izvodjaca";

const Dashboard = ({ userData }) => {
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
  };

  const slides = [1, 2, 3, 4, 5].map((n) => `/assets/slider${n}.jpg`);

  // ===== Stats state =====
  const token =
    userData?.token || (typeof sessionStorage !== "undefined" && sessionStorage.getItem("userToken"));
  const isAdmin =
    (userData?.app_employee ?? parseInt(sessionStorage.getItem("app_employee") || "0", 10)) === 1;

  const [stats, setStats] = useState(null);
  const [perEvent, setPerEvent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!token || !isAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setErr(null);
    fetch("http://127.0.0.1:8000/api/rezervacije/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Ne mogu da dohvatim statistiku.");
        setStats(data?.stats || null);
        setPerEvent(Array.isArray(data?.po_dogadjaju) ? data.po_dogadjaju : []);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [token, isAdmin]);

  // Nice labels for the X axis (shorten long event names)
  const chartData = useMemo(
    () =>
      perEvent.map((d) => ({
        ...d,
        nazivShort: (d?.naziv || "—").length > 18 ? d.naziv.slice(0, 18) + "…" : d?.naziv || "—",
      })),
    [perEvent]
  );

  const fmt = (n) =>
    typeof n === "number" ? n.toLocaleString("sr-RS") : n ?? "—";

  // NOVO: Top 5 izvođača (global chart id = 0)
  const { izvodjaci, loading: topLoading, error: topErr } = useTop5Izvodjaca(0);

  return (
    <div className="dashboard-page" style={{ marginTop: "1300px" }}>
      <div className="dashboard-hero">
        <h1 className="dashboard-title">
          Dobrodošli na administratorski panel <span style={{ color: "#f89c1c" }}>EasyBook</span>
        </h1>
        <p className="dashboard-subtitle">
          Ovde možete da kreirate, uređujete i brišete događaje, kao i da pratite i upravljate rezervacijama korisnika.
          Iskoristite alate ispod da optimalno organizujete vašu platformu.
        </p>
        <div className="dashboard-buttons">
          <Button text="Menadžment Događaja" onClick={() => navigate("/admin/dogadjaji")} />
          <Button text="Menadžment Rezervacija" onClick={() => navigate("/rezervacije")} />
        </div>
      </div>

      <div className="dashboard-carousel-container">
        <Slider {...sliderSettings}>
          {slides.map((src, i) => (
            <div key={i} className="dashboard-carousel-slide">
              <img src={src} alt={`Slide ${i + 1}`} />
            </div>
          ))}
        </Slider>
      </div>

      {/* ===== Stats + Charts (below the slider) ===== */}
      {isAdmin && (
        <div style={{ marginTop: 24 ,
                marginLeft: "100px",
                marginRight: "100px"}}>
          {/* KPIs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {loading ? (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 12 }}>
                Učitavanje statistike…
              </div>
            ) : err ? (
              <div style={{ gridColumn: "1 / -1", color: "#e63946", textAlign: "center", padding: 12 }}>
                {err}
              </div>
            ) : stats ? (
              <>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: 16,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    border: "1px solid #eee",
                  }}
                >
                  <div style={{ color: "#777", marginBottom: 6 }}>Ukupno rezervacija</div>
                  <div style={{ fontSize: 28, color: "#e44d26", fontWeight: 700 }}>
                    {fmt(stats.ukupno_rezervacija)}
                  </div>
                </div>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: 16,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    border: "1px solid #eee",
                  }}
                >
                  <div style={{ color: "#777", marginBottom: 6 }}>Plaćeno</div>
                  <div style={{ fontSize: 28, color: "#0b7a3b", fontWeight: 700 }}>
                    {fmt(stats.placeno)}
                  </div>
                </div>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: 16,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    border: "1px solid #eee",
                  }}
                >
                  <div style={{ color: "#777", marginBottom: 6 }}>Neplaćeno</div>
                  <div style={{ fontSize: 28, color: "#e44d26", fontWeight: 700 }}>
                    {fmt(stats.neplaceno)}
                  </div>
                </div>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: 16,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    border: "1px solid #eee",
                  }}
                >
                  <div style={{ color: "#777", marginBottom: 6 }}>Ukupno karata</div>
                  <div style={{ fontSize: 28, color: "#e44d26", fontWeight: 700 }}>
                    {fmt(stats.ukupno_karata)}
                  </div>
                </div>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: 16,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    border: "1px solid #eee",
                  }}
                >
                  <div style={{ color: "#777", marginBottom: 6 }}>Prihod (ukupno)</div>
                  <div style={{ fontSize: 24, color: "#f89c1c", fontWeight: 700 }}>
                    {fmt(stats.prihod_ukupno)} RSD
                  </div>
                </div>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: 16,
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    border: "1px solid #eee",
                  }}
                >
                  <div style={{ color: "#777", marginBottom: 6 }}>Prihod (plaćeno)</div>
                  <div style={{ fontSize: 24, color: "#0b7a3b", fontWeight: 700 }}>
                    {fmt(stats.prihod_placeno)} RSD
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {/* Charts row */}
          {!loading && !err && perEvent.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginLeft: "100px",
                marginRight: "100px"
              }}
            >
              {/* Bar: Prihod po događaju */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 12,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  border: "1px solid #eee",
                  minHeight: 360,
                }}
              >
                <h3 style={{ margin: "6px 0 12px", color: "#e44d26" }}>Prihod po događaju</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nazivShort" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="prihod_ukupno" name="Prihod ukupno" fill="#f89c1c" />
                    <Bar dataKey="prihod_placeno" name="Prihod (plaćeno)" fill="#e44d26" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Line: Broj rezervacija po događaju */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 12,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  border: "1px solid #eee",
                  minHeight: 360,
                }}
              >
                <h3 style={{ margin: "6px 0 12px", color: "#e44d26" }}>Rezervacije po događaju</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nazivShort" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="broj_rezervacija" name="Broj rezervacija" stroke="#f89c1c" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="ukupno_karata" name="Ukupno karata" stroke="#e44d26" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {!loading && !err && perEvent.length === 0 && (
            <div
              style={{
                marginTop: 8,
                background: "#fff",
                borderRadius: 12,
                padding: 16,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                border: "1px solid #eee",
                textAlign: "center",
              }}
            >
              Nema podataka za prikaz grafikona.
            </div>
          )}

          {/* ===== NOVO: Top 5 izvođača (Deezer) ispod grafika ===== */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ margin: "6px 0 12px", color: "#e44d26" }}>
              Top 5 muzičkih izvođača (Deezer Chart)
            </h3>

            {topLoading && (
              <div style={{
                background: "#fff",
                borderRadius: 12,
                padding: 16,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                border: "1px solid #eee",
                textAlign: "center",
              }}>
                Učitavanje izvođača…
              </div>
            )}

            {topErr && (
              <div style={{
                background: "#fff",
                borderRadius: 12,
                padding: 16,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                border: "1px solid #eee",
                color: "#e63946",
                textAlign: "center",
              }}>
                Nije moguće dohvatiti listu izvođača.
              </div>
            )}

            {!topLoading && !topErr && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                {izvodjaci.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      padding: 12,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      border: "1px solid #eee",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={a.slika || "/assets/default-performer.jpg"}
                      alt={a.ime}
                      style={{
                        width: 140,
                        height: 140,
                        objectFit: "cover",
                        borderRadius: "50%",
                        marginBottom: 10,
                      }}
                    />
                    <div style={{ fontWeight: 700, marginBottom: 8, color: "#333" }}>{a.ime}</div>
                    <a
                      href={a.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        textDecoration: "none",
                        background: "#e44d26",
                        color: "#fff",
                        padding: "8px 12px",
                        borderRadius: 8,
                        fontWeight: 600,
                      }}
                    >
                      Profil
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* ===== Kraj Top 5 izvođača ===== */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
