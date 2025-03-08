import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Kartica from "../components/Kartica";

const Dogadjaji = ({ userData }) => {
  const token = userData?.token || sessionStorage.getItem("userToken");

  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [pexelsImages, setPexelsImages] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortPrice, setSortPrice] = useState("none");
  const [filterType, setFilterType] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  useEffect(() => {
    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/dogadjaji", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setEvents(res.data.data);
        })
        .catch((err) => console.error("Greška pri dohvaćanju događaja:", err));
    }
  }, [token]);

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_PEXELS_API_KEY;
    if (API_KEY) {
      axios
        .get("https://api.pexels.com/v1/search", {
          headers: { Authorization: API_KEY },
          params: { query: "events", per_page: 50 },
        })
        .then((res) => {
          if (res.data && Array.isArray(res.data.photos)) {
            setPexelsImages(res.data.photos);
          } else {
            setPexelsImages([]);
          }
        })
        .catch((err) =>
          console.error("Greška pri dohvaćanju slika sa Pexelsa:", err)
        );
    }
  }, []);

  const filteredEvents = events
    .filter((evt) => evt.naziv.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((evt) => (!filterType ? true : evt.tip_dogadjaja === filterType))
    .sort((a, b) => (sortPrice === "asc" ? a.cena - b.cena : sortPrice === "desc" ? b.cena - a.cena : 0));

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  return (
    <div className="dogadjaji-page">
      <div className="title-container">
        <span
          className="toggle-arrow"
          data-tooltip-id="tooltip"
          data-tooltip-hidden={!isHovered}  
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          data-tooltip-content= {!showFilters ? "Prikaži filtere" : "Sakrij filtere"}
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <FaSearch className="search-icon" />
          </div>

          <div className="sort-container">
            <label>Sortiraj po ceni:</label>
            <select value={sortPrice} onChange={(e) => setSortPrice(e.target.value)}>
              <option value="none">Bez sortiranja</option>
              <option value="asc">Rastuće</option>
              <option value="desc">Opadajuće</option>
            </select>
          </div>

          <div className="filter-type-container">
            <label>Filtriraj po tipu:</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
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
        {currentEvents.map((evt) => {
          let imageUrl = "/assets/default.jpg";
          if (pexelsImages.length > 0) {
            const randomIndex = Math.floor(Math.random() * pexelsImages.length);
            imageUrl = pexelsImages[randomIndex].src.medium;
          }
          return (
            <Kartica
              key={evt.id}
              imageUrl={imageUrl}
              name={evt.naziv}
              location={evt.lokacija}
              type={evt.tip_dogadjaja}
              price={evt.cena}
              onClickDetails={() => navigate(`/dogadjaj/${evt.id}`)}
            >
            </Kartica>
          );
        })}
      </div>

      <div className="paginacija">
        <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Prethodna
        </button>
        <span style={{width:"400px", paddingLeft:"40px", paddingTop:"5px", fontSize:"20px"}}>Strana {currentPage} od {totalPages}</span>
        <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Sledeća
        </button>
      </div>
    </div>
  );
};

export default Dogadjaji;
