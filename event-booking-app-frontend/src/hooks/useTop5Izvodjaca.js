// /src/hooks/useTop5Izvodjaca.js
import { useEffect, useState } from "react";

const mapArtists = (arr = []) =>
  arr.slice(0, 5).map((a) => ({
    id: a.id,
    ime: a.name,
    slika: a.picture_medium || a.picture_big || a.picture || "",
    link: a.link,
  }));

const useTop5Izvodjaca = (countryId = 0) => {
  const [izvodjaci, setIzvodjaci] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    let alive = true;
    let resolved = false;

    const originalJsonUrl = `https://api.deezer.com/chart/${countryId}/artists?limit=5`;
    const callbackName = `dzCb_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

    const finish = (data, errMsg = null) => {
      if (!alive || resolved) return;
      resolved = true;
      if (errMsg) {
        setError(errMsg);
        setIzvodjaci([]);
      } else {
        const list = Array.isArray(data?.data) ? mapArtists(data.data) : [];
        setIzvodjaci(list);
      }
      setLoading(false);
      // clean JSONP callback
      try { delete window[callbackName]; } catch {}
    };

    const fallbackViaAllOrigins = () => {
      // Proxy koji vraća CORS-ok JSON kao string u "contents"
      fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(originalJsonUrl)}`)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("AllOrigins HTTP error"))))
        .then((obj) => {
          const json = JSON.parse(obj.contents || "{}");
          finish(json);
        })
        .catch((e) => finish(null, e.message || "Neuspelo učitavanje (proxy)."));
    };

    // 1) Pokušaj JSONP
    window[callbackName] = (payload) => finish(payload);
    const s = document.createElement("script");
    s.src = `${originalJsonUrl}&output=jsonp&callback=${callbackName}`;
    s.async = true;
    s.crossOrigin = "anonymous";
    s.referrerPolicy = "no-referrer";
    s.onerror = () => {
      if (!resolved) fallbackViaAllOrigins();
    };
    document.body.appendChild(s);

    // 2) Safety timeout – ako JSONP ne odgovori
    const t = setTimeout(() => {
      if (!resolved) fallbackViaAllOrigins();
    }, 8000);

    return () => {
      alive = false;
      clearTimeout(t);
      try { s.remove(); } catch {}
      try { delete window[callbackName]; } catch {}
    };
  }, [countryId]);

  return { izvodjaci, loading, error };
};

export default useTop5Izvodjaca;
