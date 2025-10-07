import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import image from '../assets/velora-logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartItemsCount } = useCart();
  const location = useLocation();
  const cartItemsCount = getCartItemsCount();
  const [ifLogedIn, setIfLogedIn] = useState(false);

  const navItems = [
    { name: 'Home', path: '/Velora/' },
    { name: 'Shop', path: '/Velora/shop' },
    { name: 'About', path: '/Velora/about' },
    { name: 'Contact', path: '/Velora/contact' },
  ];

const isActiveLink = (path) => {
    return location.pathname === path;
};

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/Velora/" className="navbar-logo" >
            <img src={image} alt="" width={53.5} height={50}/>
            VELORA
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-nav md:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`navbar-nav-item ${
                  isActiveLink(item.path)
                    ? 'active'
                    : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="navbar-actions md:flex">
            <button className="navbar-icon-btn">
              <Search size={20} />
            </button>
            <button className="navbar-icon-btn">
              <Link to="/Velora/"></Link>
              <User size={20} />
            </button>
            <Link to="/Velora/cart" className="navbar-cart-btn">
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="navbar-cart-badge">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="navbar-mobile md:hidden">
            <Link to="/Velora/cart" className="navbar-cart-btn">
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="navbar-cart-badge">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="navbar-mobile-menu-btn"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="navbar-mobile-menu md:hidden">
            <div className="navbar-mobile-nav">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`navbar-mobile-nav-item ${
                    isActiveLink(item.path)
                      ? 'active'
                      : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="navbar-mobile-actions">
                <button className="navbar-icon-btn">
                  <Search size={20} />
                </button>
                <button className="navbar-icon-btn">
                  {
                    ifLogedIn ? <Link to="/Velora/profile"><User size={20} /></Link> : <Link to="/Velora/login">Login/Signup</Link>
                  }
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;