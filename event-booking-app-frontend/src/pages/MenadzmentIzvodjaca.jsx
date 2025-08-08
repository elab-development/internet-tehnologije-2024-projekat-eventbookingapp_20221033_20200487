import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const ZANROVI = ["pop", "folk", "rep", "rok", "klasika", "tehno", "narodna"];

const MenadzmentIzvodjaca = ({ userData }) => {
  const navigate = useNavigate();
  const token =
    userData?.token || (typeof sessionStorage !== "undefined" && sessionStorage.getItem("userToken"));

  const [performers, setPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // filters & sorting
  const [q, setQ] = useState("");
  const [sortDir, setSortDir] = useState("asc"); // asc|desc

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // modal state (used for both create & edit)
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create|edit
  const [submitting, setSubmitting] = useState(false);
  const [formErr, setFormErr] = useState(null);
  const [form, setForm] = useState({
    id: null,
    ime: "",
    zanr: "pop",
    biografija: "",
    link_slike: "",
  });

  // fetch list
  const load = () => {
    setLoading(true);
    setErr(null);
    fetch("http://127.0.0.1:8000/api/izvodjaci", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Greška pri učitavanju izvođača.");
        const data = await res.json();
        setPerformers(data?.data ?? data ?? []);
        setPage(1); // reset when list changes
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!token) return;
    load();
  }, [token]);

  // filtered & sorted list (client side)
  const list = useMemo(() => {
    const filtered = performers.filter((p) => {
      const t = q.trim().toLowerCase();
      if (!t) return true;
      return (
        p.ime?.toLowerCase().includes(t) ||
        p.zanr?.toLowerCase().includes(t) ||
        p.biografija?.toLowerCase().includes(t)
      );
    });
    const sorted = filtered.sort((a, b) => {
      const an = (a.ime || "").toLowerCase();
      const bn = (b.ime || "").toLowerCase();
      if (an < bn) return sortDir === "asc" ? -1 : 1;
      if (an > bn) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [performers, q, sortDir]);

  // reset page on search/sort changes
  useEffect(() => {
    setPage(1);
  }, [q, sortDir]);

  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const start = (page - 1) * pageSize;
  const currentRows = list.slice(start, start + pageSize);

  // modal helpers
  const openCreate = () => {
    setMode("create");
    setFormErr(null);
    setForm({
      id: null,
      ime: "",
      zanr: "pop",
      biografija: "",
      link_slike: "",
    });
    setOpen(true);
  };

  const openEdit = (p) => {
    setMode("edit");
    setFormErr(null);
    setForm({
      id: p.id,
      ime: p.ime || "",
      zanr: p.zanr || "pop",
      biografija: p.biografija || "",
      link_slike: p.link_slike || "",
    });
    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormErr(null);

    const url =
      mode === "create"
        ? "http://127.0.0.1:8000/api/izvodjaci"
        : `http://127.0.0.1:8000/api/izvodjaci/${form.id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const payload = {
      ime: form.ime,
      zanr: form.zanr,
      biografija: form.biografija,
      link_slike: form.link_slike || undefined, // will be used if backend validation allows
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Operacija nije uspela.");
      closeModal();
      load();
    } catch (e2) {
      setFormErr(e2.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return <p className="mi-error">Niste prijavljeni.</p>;
  }

  return (
    <div className="mi-page">
      <div className="mi-header">
        <h1>Menadžment Izvođača</h1>
        <div className="mi-controls">
          <input
            className="mi-search"
            type="text"
            placeholder="Pretraži po imenu, žanru ili biografiji…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            className="mi-ghost-btn"
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            title="Sortiraj po imenu"
          >
            Sortiraj po imenu {sortDir === "asc" ? "↑" : "↓"}
          </button>
          <Button text="Novi izvođač" onClick={openCreate} />
        </div>
      </div>

      {loading && <p className="mi-loading">Učitavanje izvođača…</p>}
      {err && <p className="mi-error">{err}</p>}

      {!loading && !err && (
        <>
          <div className="mi-table-wrap">
            <table className="mi-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Avatar</th>
                  <th>Ime</th>
                  <th>Žanr</th>
                  <th>Biografija</th>
                  <th>Link slike</th>
                  <th style={{ textAlign: "right" }}>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>
                      Nema rezultata.
                    </td>
                  </tr>
                ) : (
                  currentRows.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>
                        <img
                          src={p.link_slike || "/assets/default-performer.jpg"}
                          alt={p.ime}
                          className="mi-avatar"
                        />
                      </td>
                      <td>{p.ime}</td>
                      <td>
                        <span className="mi-badge">{p.zanr}</span>
                      </td>
                      <td className="mi-bio">{p.biografija || "—"}</td>
                      <td className="mi-link">
                        {p.link_slike ? (
                          <a href={p.link_slike} target="_blank" rel="noreferrer">
                            otvori
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button className="mi-ghost-btn" onClick={() => openEdit(p)}>
                          Izmeni
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="mi-pagination" style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
            <Button
              text="Prethodna"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              type="button"
              disabled={page === 1}
            />
            <span style={{ alignSelf: "center", whiteSpace: "nowrap" }}>
              Strana {page} od {totalPages}
            </span>
            <Button
              text="Sledeća"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              type="button"
              disabled={page === totalPages}
            />
          </div>
        </>
      )}

      {open && (
        <div className="mi-modal-overlay" onClick={closeModal}>
          <div className="mi-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{mode === "create" ? "Novi izvođač" : "Izmena izvođača"}</h2>
            {formErr && <p className="mi-form-error">{formErr}</p>}

            <form onSubmit={submit} className="mi-form">
              <label>
                Ime
                <input name="ime" value={form.ime} onChange={handleChange} required />
              </label>

              <label>
                Žanr
                <select name="zanr" value={form.zanr} onChange={handleChange}>
                  {ZANROVI.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Biografija
                <textarea
                  name="biografija"
                  value={form.biografija}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Kratka biografija izvođača…"
                />
              </label>

              <label>
                Link slike (opciono)
                <input
                  name="link_slike"
                  value={form.link_slike}
                  onChange={handleChange}
                  placeholder="https://…"
                />
              </label>

              <div className="mi-form-actions">
                <button
                  type="button"
                  className="mi-ghost-btn"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Otkaži
                </button>
                <Button type="submit" text={submitting ? "Sačuvavam…" : "Sačuvaj"} />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenadzmentIzvodjaca;
