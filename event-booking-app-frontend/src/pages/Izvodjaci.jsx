import React from "react";
import usePerformers from "../hooks/usePerformers";

const Izvodjaci = ({ userData }) => {
  const token = userData?.token || sessionStorage.getItem("userToken");

  const { performers, loading, error } = usePerformers(token);

  if (loading) return <p style={{ padding: "20px" }}>Učitavanje izvođača...</p>;
  if (error) return <p style={{ padding: "20px" }}>Greška pri učitavanju izvođača.</p>;

  return (
    <div className="izvodjaci-container">
      <h1>Lista Izvođača</h1>
      <table className="modern-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Ime</th>
            <th>Žanr</th>
            <th>Biografija</th>
          </tr>
        </thead>
        <tbody>
          {performers.length > 0 ? (
            performers.map((performer) => (
              <tr key={performer.id}>
                <td>{performer.id}</td>
                <td>{performer.ime}</td>
                <td>{performer.zanr}</td>
                <td className="bio-column">{performer.biografija || "Nema biografije"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Nema dostupnih izvođača</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Izvodjaci;
