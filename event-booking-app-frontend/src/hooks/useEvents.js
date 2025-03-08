import { useState, useEffect } from "react";
import axios from "axios";

const useEvents = (token) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      setLoading(true);
      axios
        .get("http://127.0.0.1:8000/api/dogadjaji", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setEvents(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Greška pri dohvaćanju događaja:", err);
          setError(err);
          setLoading(false);
        });
    }
  }, [token]);

  return { events, loading, error };
};

export default useEvents;
