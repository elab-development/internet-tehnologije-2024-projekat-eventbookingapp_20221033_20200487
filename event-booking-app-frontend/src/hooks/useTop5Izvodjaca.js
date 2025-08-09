// /src/hooks/useTop5Izvodjaca.js
import { useEffect, useState } from "react";

// Map Deezer artists -> your UI fields
const mapArtists = (arr = []) =>
  arr.slice(0, 5).map((a) => ({
    id: a.id,
    ime: a.name,
    slika: a.picture_medium || a.picture_big || a.picture || "",
    link: a.link,
  }));

// "Always works" fallback if every remote call fails
const FALLBACK = [
  { id: 1, ime: "Taylor Swift", slika: "", link: "https://www.deezer.com" },
  { id: 2, ime: "The Weeknd",   slika: "", link: "https://www.deezer.com" },
  { id: 3, ime: "Bad Bunny",    slika: "", link: "https://www.deezer.com" },
  { id: 4, ime: "Drake",        slika: "", link: "https://www.deezer.com" },
  { id: 5, ime: "Dua Lipa",     slika: "", link: "https://www.deezer.com" },
];

const useTop5Izvodjaca = (countryId = 0) => {
  const [izvodjaci, setIzvodjaci] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    let alive = true;
    let resolved = false;

    const baseUrl = `https://api.deezer.com/chart/${countryId}/artists?limit=5`;

    const finish = (payload, errMsg = null) => {
      if (!alive || resolved) return;
      resolved = true;

      if (payload && Array.isArray(payload.data)) {
        setIzvodjaci(mapArtists(payload.data));
        setError(null);
      } else if (!payload && errMsg) {
        // total failure -> fallback so UI still works
        setIzvodjaci(FALLBACK);
        setError(errMsg);
      } else {
        setIzvodjaci(FALLBACK);
        setError("Nepoznat format odgovora.");
      }
      setLoading(false);
    };

    // Try JSONP first (if Deezer supports it; some browsers enforce CORB/CORS anyway)
    const tryJsonp = () =>
      new Promise((resolve, reject) => {
        const cb = `dzCb_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
        const script = document.createElement("script");

        // Define global callback
        window[cb] = (json) => {
          try {
            resolve(json);
          } finally {
            delete window[cb];
            script.remove();
          }
        };

        script.src = `${baseUrl}&output=jsonp&callback=${cb}`;
        script.async = true;
        script.onerror = () => {
          delete window[cb];
          script.remove();
          reject(new Error("JSONP blokiran/CORS"));
        };

        // Safety timeout for JSONP
        const t = setTimeout(() => {
          delete window[cb];
          try { script.remove(); } catch {}
          reject(new Error("JSONP timeout"));
        }, 7000);

        // If it resolves/rejects, clear timeout
        const origResolve = resolve;
        const origReject = reject;
        resolve = (v) => { clearTimeout(t); origResolve(v); };
        reject = (e) => { clearTimeout(t); origReject(e); };

        document.body.appendChild(script);
      });

    // Fetch helper with timeout, returns text
    const fetchText = (url, ms = 8000) =>
      new Promise((resolve, reject) => {
        const ctrl = new AbortController();
        const id = setTimeout(() => ctrl.abort(), ms);
        fetch(url, {
          // DO NOT use mode:"no-cors" (opaque = unreadable). We need readable responses.
          method: "GET",
          headers: { "Accept": "*/*" },
          signal: ctrl.signal,
        })
          .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
          .then((txt) => resolve(txt))
          .catch(reject)
          .finally(() => clearTimeout(id));
      });

    // Try a chain of public proxies that usually allow CORS:
    // 1) allorigins RAW (returns plain body)
    // 2) allorigins JSON (parse from .contents)
    // 3) r.jina.ai (caches & returns body as text/plain with CORS *)
    const tryProxies = async () => {
      const attempts = [
        async () => {
          const txt = await fetchText(`https://api.allorigins.win/raw?url=${encodeURIComponent(baseUrl)}`);
          return JSON.parse(txt);
        },
        async () => {
          const txt = await fetchText(`https://api.allorigins.win/get?url=${encodeURIComponent(baseUrl)}`);
          // format: { contents: "<stringified JSON from target>" }
          const outer = JSON.parse(txt);
          return JSON.parse(outer?.contents || "{}");
        },
        async () => {
          // r.jina.ai returns the target body as text (CORS enabled); parse to JSON
          const txt = await fetchText(`https://r.jina.ai/http://api.deezer.com/chart/${countryId}/artists?limit=5`);
          return JSON.parse(txt);
        },
      ];

      let lastErr = null;
      for (const step of attempts) {
        try {
          const json = await step();
          if (json && (Array.isArray(json.data) || json.data)) return json;
        } catch (e) {
          lastErr = e;
        }
      }
      throw lastErr || new Error("Svi proxy pokušaji su propali.");
    };

    (async () => {
      setLoading(true);
      setError(null);

      try {
        // 1) JSONP (fast path if browser accepts it)
        const jsonpResult = await tryJsonp();
        finish(jsonpResult);
      } catch (_) {
        // 2) Proxies chain
        try {
          const proxied = await tryProxies();
          finish(proxied);
        } catch (e2) {
          // 3) Hard fallback — never break the UI
          finish(null, e2?.message || "Nije moguće dohvatiti podatke (CORS/proxy).");
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [countryId]);

  return { izvodjaci, loading, error };
};

export default useTop5Izvodjaca;
