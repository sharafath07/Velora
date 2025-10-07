import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <h3 className="footer-brand-title">Velora</h3>
            <p className="footer-brand-description">
              Defining luxury through timeless elegance. Discover our curated collection 
              of premium clothing designed for the modern sophisticated woman.
            </p>
            <div className="footer-social">
              <a href="#" className="footer-social-link" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="footer-social-link" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="footer-social-link" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/Velora/shop" className="footer-link">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/Velora/about" className="footer-link">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/Velora/contact" className="footer-link">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-section">
            <h4 className="footer-section-title">Customer Service</h4>
            <ul className="footer-links">
              <li>
                <a href="#" className="footer-link">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-section-title">Get In Touch</h4>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <MapPin size={16} className="footer-contact-icon" />
                <span className="footer-contact-text">
                  123 Fashion Ave, New York, NY 10001
                </span>
              </div>
              <div className="footer-contact-item">
                <Phone size={16} className="footer-contact-icon" />
                <span className="footer-contact-text">+1 (555) 123-4567</span>
              </div>
              <div className="footer-contact-item">
                <Mail size={16} className="footer-contact-icon" />
                <span className="footer-contact-text">hello@velora.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="footer-bottom-text">
            © 2024 Velora. All rights reserved. Crafted with passion for luxury fashion.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;