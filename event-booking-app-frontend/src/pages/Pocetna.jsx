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
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Dobrodošli u EasyBook</h1>
        <p>
          EasyBook je najmodernija platforma za jednostavnu i brzu rezervaciju događaja.
          Pružamo korisnicima intuitivan način da pronađu, rezervišu i organizuju događaje bez stresa.
        </p>
        <div className="hero-buttons">
          <Button text="Zakazi dogadjaj" onClick={() => navigate("/registracija")} />
          <Button text="Pogledaj Izvodjace" onClick={() => navigate("/")} />
        </div>
      </div>

      <div className="carousel-container">
        <Slider {...sliderSettings}>
          <div>
            <img src="/assets/slider1.jpg" alt="Slika 1" />
          </div>
          <div>
            <img src="/assets/slider2.jpg" alt="Slika 2" />
          </div>
          <div>
            <img src="/assets/slider3.jpg" alt="Slika 3" />
          </div>
          <div>
            <img src="/assets/slider4.jpg" alt="Slika 4" />
          </div>
          <div>
            <img src="/assets/slider5.jpg" alt="Slika 5" />
          </div>
          <div>
            <img src="/assets/slider6.jpg" alt="Slika 6" />
          </div>
          <div>
            <img src="/assets/slider7.jpg" alt="Slika 7" />
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default Pocetna;
