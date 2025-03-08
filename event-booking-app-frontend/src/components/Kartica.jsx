import React from "react";

const Kartica = ({ imageUrl, name, location, type, price, onClickDetails }) => {
  return (
    <div className="kartica">
      <div className="kartica-image-container">
        <img src={imageUrl} alt={name} className="kartica-image" />
      </div>
      <div className="kartica-info">
        <h3>{name}</h3>
        <p> <span style={{color:"#FF7043", fontWeight:"bold"}}>Lokacija: </span>{location}</p>
        <p> <span style={{color:"#FF7043", fontWeight:"bold"}}>Tip dogadjaja: </span>{type}</p>
        <p> <span style={{color:"#FF7043", fontWeight:"bold"}}> Cena: </span>{price} RSD</p>
        <button className="kartica-btn" onClick={onClickDetails}>
          Pogledaj detaljnije
        </button>
      </div>
    </div>
  );
};

export default Kartica;
