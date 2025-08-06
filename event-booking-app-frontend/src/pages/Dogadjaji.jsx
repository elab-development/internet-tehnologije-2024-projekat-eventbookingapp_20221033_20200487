import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { useNavigate, Link } from "react-router-dom";
import useEvents from "../hooks/useEvents";
import Kartica from "../components/Kartica";

const Dogadjaji = ({ userData }) => {
  const token = userData?.token || sessionStorage.getItem("userToken");
  const navigate = useNavigate();

  const { events, loading, error } = useEvents(token);
  const [isHovered, setIsHovered] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortPrice, setSortPrice] = useState("none");
  const [filterType, setFilterType] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  if (loading) return <p>Učitavanje događaja...</p>;
  if (error)   return <p>Došlo je do greške pri učitavanju događaja.</p>;

  // Filter & sort
  const filtered = events
    .filter(evt => evt.naziv.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(evt => (!filterType || evt.tip_dogadjaja === filterType))
    .sort((a, b) =>
      sortPrice === "asc"  ? a.cena - b.cena
    : sortPrice === "desc" ? b.cena - a.cena
    : 0
  );

  // Pagination
  const lastIdx = currentPage * eventsPerPage;
  const firstIdx = lastIdx - eventsPerPage;
  const currentEvents = filtered.slice(firstIdx, lastIdx);
  const totalPages = Math.ceil(filtered.length / eventsPerPage);

  return (
    <div className="dogadjaji-page">
      <div>
        <Link style={{color:"#FF7043", fontWeight:"bold"}} to="/pocetna">Početna</Link> &gt; 
        <span style={{fontWeight:"bold"}}>Dogadjaji</span>
      </div>

      <div className="title-container">
        <span
          className="toggle-arrow"
          data-tooltip-id="tooltip"
          data-tooltip-hidden={!isHovered}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          data-tooltip-content={!showFilters ? "Prikaži filtere" : "Sakrij filtere"}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? <IoIosArrowDown /> : <IoIosArrowForward />}
        </span>
        <h1>Dogadjaji</h1>
      </div>

      {showFilters && (
        <div className="filter-box">
          <div className="search-container">
            <input
              type="text"
              placeholder="Pretraži po nazivu"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <FaSearch className="search-icon" />
          </div>

          <div className="sort-container">
            <label>Sortiraj po ceni:</label>
            <select value={sortPrice} onChange={e => setSortPrice(e.target.value)}>
              <option value="none">Bez sortiranja</option>
              <option value="asc">Rastuće</option>
              <option value="desc">Opadajuće</option>
            </select>
          </div>

          <div className="filter-type-container">
            <label>Filtriraj po tipu:</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="">Svi tipovi</option>
              <option value="koncert">Koncert</option>
              <option value="konferencija">Konferencija</option>
              <option value="festival">Festival</option>
              <option value="predstava">Predstava</option>
              <option value="izlozba">Izlozba</option>
            </select>
          </div>
        </div>
      )}

      <div className="dogadjaji-list">
        {currentEvents.map(evt => (
          <Kartica
            key={evt.id}
            imageUrl={evt.link_slike || "/assets/default.jpg"}
            name={evt.naziv}
            location={evt.lokacija}
            type={evt.tip_dogadjaja}
            price={evt.cena}
            onClickDetails={() => navigate(`/dogadjaj/${evt.id}`)}
          />
        ))}
      </div>

      <div className="paginacija">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Prethodna
        </button>
        <span style={{ width: "400px", paddingLeft: "40px", paddingTop: "5px", fontSize: "20px" }}>
          Strana {currentPage} od {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Sledeća
        </button>
      </div>
    </div>
  );
};

export default Dogadjaji;
