import React, { useEffect, useMemo, useState } from "react";
import Button from "../components/Button";

const Rezervacije = ({ userData }) => {
  const token =
    userData?.token || (typeof sessionStorage !== "undefined" && sessionStorage.getItem("userToken"));
  const isAdmin =
    (userData?.app_employee ?? parseInt(sessionStorage.getItem("app_employee") || "0", 10)) === 1;

  // list state
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // details modal
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailErr, setDetailErr] = useState(null);

  // status patch
  const [statusSaving, setStatusSaving] = useState(false);
  const [statusErr, setStatusErr] = useState(null);

  // export csv
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!token || !isAdmin) return;
    setLoading(true);
    setErr(null);
    fetch("http://127.0.0.1:8000/api/rezervacije", {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Greška pri učitavanju rezervacija.");
        const data = await res.json();
        setItems(data?.data ?? data ?? []);
        setPage(1);
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [token, isAdmin]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page]);

  function openDetails(id) {
    setSelectedId(id);
    setDetail(null);
    setDetailErr(null);
    setStatusErr(null);
    setOpen(true);
    setDetailLoading(true);
    fetch(`http://127.0.0.1:8000/api/rezervacije/${id}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Greška pri učitavanju detalja.");
        setDetail(data?.data ?? data);
      })
      .catch((e) => setDetailErr(e.message))
      .finally(() => setDetailLoading(false));
  }

  function closeDetails() {
    setOpen(false);
    setSelectedId(null);
    setDetail(null);
    setStatusErr(null);
  }

  async function patchStatus(newStatus) {
    if (!selectedId) return;
    setStatusSaving(true);
    setStatusErr(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/rezervacije/${selectedId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Ažuriranje statusa nije uspelo.");

      const updated = data?.rezervacija ?? data?.data ?? data;

      // osveži detalj
      setDetail((d) => (d ? { ...d, status: updated.status } : updated));

      // osveži red u listi
      setItems((prev) =>
        prev.map((r) => (r.id === updated.id ? { ...r, status: updated.status } : r))
      );
    } catch (e) {
      setStatusErr(e.message);
    } finally {
      setStatusSaving(false);
    }
  }

  async function exportCsv() {
    try {
      setExporting(true);
      const res = await fetch("http://127.0.0.1:8000/api/rezervacije/export/csv", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Greška pri eksportu CSV fajla.");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      a.href = url;
      a.download = `rezervacije_${stamp}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert(e.message);
    } finally {
      setExporting(false);
    }
  }

  if (!token || !isAdmin) {
    return <p className="rez-error">Ova stranica je dostupna samo radnicima (adminima).</p>;
  }

  return (
    <div className="rez-page">
      <div className="rez-header">
        <h1>Rezervacije — Admin pregled</h1>
        <p className="rez-subtitle">
          Prikaz svih rezervacija. Klikom na <em>Promeni status</em> otvarate modal sa kompletnim
          informacijama i akcijom za ažuriranje statusa.
        </p>
        <div className="rez-actions" style={{marginLeft:"1000px", marginBottom:"20px"}}>
          <Button
            text={exporting ? "Eksportujem…" : "Export CSV"}
            type="button"
            onClick={exportCsv}
          />
        </div>
      </div>

      {loading && <p className="rez-loading">Učitavanje…</p>}
      {err && <p className="rez-error">{err}</p>}

      {!loading && !err && (
        <>
          <div className="rez-table-wrap">
            <table className="rez-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Korisnik</th>
                  <th>Događaj</th>
                  <th>Datum rez.</th>
                  <th>Status</th>
                  <th>Karte</th>
                  <th>Tip</th>
                  <th>Ukupno (RSD)</th>
                  <th style={{ textAlign: "right" }}>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: "center" }}>
                      Nema rezervacija.
                    </td>
                  </tr>
                ) : (
                  paginated.map((r) => {
                    const cenaKarte = r?.cena_karte ?? r?.dogadjaj?.cena ?? 0;
                    const ukupno = r?.ukupna_cena ?? Math.round(cenaKarte * (r?.broj_karata ?? 0));
                    const korisnikIme = r?.korisnik?.name || (r?.korisnik?.ime ?? "—");
                    return (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{korisnikIme || "—"}</td>
                        <td>{r?.dogadjaj?.naziv || "—"}</td>
                        <td>{r?.datum || "—"}</td>
                        <td>
                          <span className={`rez-badge rez-${r?.status || "nepoznat"}`}>
                            {r?.status || "—"}
                          </span>
                        </td>
                        <td>{r?.broj_karata ?? "—"}</td>
                        <td>{r?.tip_karti ?? "—"}</td>
                        <td>{ukupno}</td>
                        <td style={{ textAlign: "right" }}>
                          <button className="rez-ghost-btn" onClick={() => openDetails(r.id)}>
                            Promeni status
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="rez-pagination">
            <Button
              text="Prethodna"
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            />
            <span style={{ alignSelf: "center", whiteSpace: "nowrap" }}>
              Strana {page} od {totalPages}
            </span>
            <Button
              text="Sledeća"
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            />
          </div>
        </>
      )}

      {open && (
        <div className="rez-modal-overlay" onClick={closeDetails}>
          <div className="rez-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Detalji rezervacije</h2>
            {detailLoading && <p>Učitavanje detalja…</p>}
            {detailErr && <p className="rez-error">{detailErr}</p>}
            {detail && (
              <div className="rez-detail">
                <div className="rez-detail-row">
                  <strong>ID:</strong> <span>{detail.id}</span>
                </div>
                <div className="rez-detail-row">
                  <strong>Korisnik:</strong>{" "}
                  <span>{detail?.korisnik?.name || detail?.korisnik?.ime || "—"}</span>
                </div>
                <div className="rez-detail-row">
                  <strong>Događaj:</strong> <span>{detail?.dogadjaj?.naziv || "—"}</span>
                </div>
                <div className="rez-detail-row">
                  <strong>Datum rezervacije:</strong> <span>{detail?.datum || "—"}</span>
                </div>
                <div className="rez-detail-row">
                  <strong>Status:</strong>{" "}
                  <span className={`rez-badge rez-${detail?.status || "nepoznat"}`}>
                    {detail?.status || "—"}
                  </span>
                </div>
                <div className="rez-detail-row">
                  <strong>Broj karata:</strong> <span>{detail?.broj_karata ?? "—"}</span>
                </div>
                <div className="rez-detail-row">
                  <strong>Tip karte:</strong> <span>{detail?.tip_karti ?? "—"}</span>
                </div>
                <div className="rez-detail-row">
                  <strong>Cena karte:</strong>{" "}
                  <span>{detail?.cena_karte ?? detail?.dogadjaj?.cena ?? 0} RSD</span>
                </div>
                <div className="rez-detail-row">
                  <strong>Ukupna cena:</strong>{" "}
                  <span>
                    {detail?.ukupna_cena ??
                      (detail?.dogadjaj?.cena ?? 0) * (detail?.broj_karata ?? 0)}{" "}
                    RSD
                  </span>
                </div>

                {statusErr && <div className="rez-error" style={{ marginTop: 8 }}>{statusErr}</div>}
                <div className="rez-modal-actions" style={{ gap: 8 }}>
                  <Button text="Zatvori" onClick={closeDetails} />
                  <Button
                    text={
                      statusSaving
                        ? "Ažuriram…"
                        : detail?.status === "placeno"
                        ? "Postavi na NEPLAĆENO"
                        : "Postavi na PLAĆENO"
                    }
                    onClick={() =>
                      patchStatus(detail?.status === "placeno" ? "neplaceno" : "placeno")
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Rezervacije;
