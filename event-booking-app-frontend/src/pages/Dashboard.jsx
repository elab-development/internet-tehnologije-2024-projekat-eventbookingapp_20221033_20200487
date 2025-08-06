import React from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Button from "../components/Button";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Dashboard = ({ userData }) => {
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

  // You can swap these with admin-specific images if you like
  const slides = [1, 2, 3, 4, 5].map((n) => `/assets/slider${n}.jpg`);

  return (
    <div className="dashboard-page" style={{marginTop: "500px"}}>
      <div className="dashboard-hero" >
        <h1 className="dashboard-title" >
          Dobrodošli na administratorski panel <span style={{color: "#f89c1c"}}>EasyBook</span>
        </h1>
        <p className="dashboard-subtitle">
          Ovde možete da kreirate, uređujete i brišete događaje, kao i da pratite i upravljate rezervacijama korisnika.
          Iskoristite alate ispod da optimalno organizujete vašu platformu.
        </p>
        <div className="dashboard-buttons">
          <Button
            text="Menadžment Događaja"
            onClick={() => navigate("/admin/dogadjaji")}
          />
          <Button
            text="Menadžment Rezervacija"
            onClick={() => navigate("/rezervacije")}
          />
        </div>
      </div>

      <div className="dashboard-carousel-container">
        <Slider {...sliderSettings}>
          {slides.map((src, i) => (
            <div key={i} className="dashboard-carousel-slide">
              <img src={src} alt={`Slide ${i + 1}`} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Dashboard;
