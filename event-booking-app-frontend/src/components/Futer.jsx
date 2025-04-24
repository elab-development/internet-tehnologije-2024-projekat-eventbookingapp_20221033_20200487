import React from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";

const Futer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/assets/logo.png" alt="EasyBook Logo" className="footer-logo-img" />
          <h2 className="footer-title">EasyBook</h2>
        </div>
        <p className="footer-trademark">© 2024 EasyBook. All rights reserved.</p>
        <div className="footer-icons">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <FaInstagram size={24} />
          </a>
          <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="footer-icon">
            <FaTiktok size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Futer;
