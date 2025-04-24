import { useState, useEffect } from "react";
import axios from "axios";

const usePerformers = (token) => {
  const [performers, setPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      setLoading(true);
      axios
        .get("http://127.0.0.1:8000/api/izvodjaci", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setPerformers(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Greška pri dohvaćanju izvođača:", err);
          setError(err);
          setLoading(false);
        });
    }
  }, [token]);

  return { performers, loading, error };
};

export default usePerformers;
