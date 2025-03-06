import React from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Button from "../components/Button";

const Pocetna = () => {
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Dobrodošli u <span className="highlight">EasyBook</span></h1>
        <p>
          Najmodernija platforma za jednostavno i brzo zakazivanje događaja.  
          Pronađite, rezervišite i organizujte događaje lako i bez stresa.
        </p>
        <div className="hero-buttons">
          <Button text="Zakaži događaj" onClick={() => navigate("/dogadjaji")} />
          <Button text="Pogledaj izvođače" onClick={() => navigate("/izvodjaci")} />
        </div>
      </div>

      <div className="carousel-container">
        <Slider {...sliderSettings}>
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <div key={num} className="carousel-slide">
              <img src={`/assets/slider${num}.jpg`} alt={`Slika ${num}`} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Pocetna;
