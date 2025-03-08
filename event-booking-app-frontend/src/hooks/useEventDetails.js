import { useState, useEffect } from "react";
import axios from "axios";

const useEventDetails = (id, token) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performerId, setPerformerId] = useState(null);

  useEffect(() => {
    if (id && token) {
      setLoading(true);
      axios
        .get(`http://127.0.0.1:8000/api/dogadjaji/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setEvent(res.data.data);
          if (res.data.data.izvodjac) {
            setPerformerId(res.data.data.izvodjac.id);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Greška pri dohvaćanju detalja događaja:", err);
          setError(err);
          setLoading(false);
        });
    }
  }, [id, token]);

  return { event, performerId, loading, error };
};

export default useEventDetails;
