import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer bg-gray-900 text-gray-300">
      <div className="footer-container max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-10">

        {/* Brand Section */}
        <div>
          <h3 className="text-2xl font-semibold text-white mb-3">Velora</h3>
          <p className="text-sm leading-relaxed mb-4">
            Defining luxury through timeless elegance. Discover our curated collection 
            of premium clothing designed for the modern sophisticated woman.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-white"><Instagram size={20} /></a>
            <a href="#" className="hover:text-white"><Facebook size={20} /></a>
            <a href="#" className="hover:text-white"><Twitter size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/Velora/shop" className="hover:text-white">Shop All</Link></li>
            <li><Link to="/Velora/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/Velora/contact" className="hover:text-white">Contact</Link></li>
            <li><a href="#" className="hover:text-white">Size Guide</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Customer Service</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-white">FAQ</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-3">Get In Touch</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><MapPin size={16}/> 123 Fashion Ave, New York, NY 10001</li>
            <li className="flex items-center gap-2"><Phone size={16}/> +1 (555) 123-4567</li>
            <li className="flex items-center gap-2"><Mail size={16}/> hello@velora.com</li>
          </ul>
        </div>
      </div>

      <div className="text-center border-t border-gray-700 py-4 text-xs text-gray-500">
        © 2025 Velora. All rights reserved. Crafted with passion for luxury fashion.
      </div>
    </footer>
  );
};

export default Footer;
