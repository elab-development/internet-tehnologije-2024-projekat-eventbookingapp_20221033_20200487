import { useState, useEffect } from "react";
import axios from "axios";

const usePerformer = (performerId, token) => {
  const [performer, setPerformer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (performerId && token) {
      setLoading(true);
      axios
        .get(`http://127.0.0.1:8000/api/izvodjaci/${performerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setPerformer(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Greška pri dohvaćanju izvođača:", err);
          setError(err);
          setLoading(false);
        });
    }
  }, [performerId, token]);

  return { performer, loading, error };
};

export default usePerformer;
