import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Menu,
  X,
  Search,
  User,
  ChevronDown,
  LogOut,
  Settings as SettingsIcon,
  LayoutDashboard,
  Package,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/velora-logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { getCartItemsCount } = useCart();
  const { user, logoutUser } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);
  const cartItemsCount = getCartItemsCount();

  const navItems = [
    { name: 'Home', path: '/Velora/' },
    { name: 'Shop', path: '/Velora/shop' },
    { name: 'About', path: '/Velora/about' },
    { name: 'Contact', path: '/Velora/contact' },
  ];

  const isActiveLink = (path) => location.pathname === path;

  const handleLogout = () => {
    logoutUser();
    setIsUserMenuOpen(false);
    navigate('/Velora/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar shadow-sm">
      <div className="navbar-container">
        <div className="navbar-content">
          <Link to="/Velora/" className="navbar-logo">
            <img src={logo} alt="Velora" width={50} height={50} />
            <span>Velora</span>
          </Link>

          <div className="navbar-nav md:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`navbar-nav-item ${isActiveLink(item.path) ? 'active' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="navbar-actions md:flex">
            <button className="navbar-icon-btn">
              <Search size={20} />
            </button>

            {user ? (
              <div className="navbar-user-menu" ref={userMenuRef}>
                <button
                  className="navbar-user-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User size={20} />
                  <ChevronDown size={16} className={`navbar-user-chevron ${isUserMenuOpen ? 'open' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="navbar-dropdown">
                    <div className="navbar-dropdown-header">
                      <div className="navbar-dropdown-avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="navbar-dropdown-user-info">
                        <p className="navbar-dropdown-name">{user.name}</p>
                        <p className="navbar-dropdown-email">{user.email}</p>
                      </div>
                    </div>

                    <Link to="/Velora/profile" className="navbar-dropdown-item">
                      <User size={16} /> Profile
                    </Link>
                    <Link to="/Velora/dashboard" className="navbar-dropdown-item">
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link to="/Velora/orders" className="navbar-dropdown-item">
                      <Package size={16} /> Orders
                    </Link>
                    <Link to="/Velora/settings" className="navbar-dropdown-item">
                      <SettingsIcon size={16} /> Settings
                    </Link>

                    <button className="navbar-dropdown-item logout" onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/Velora/login" className="navbar-login-btn">
                Login / Signup
              </Link>
            )}

            <Link to="/Velora/cart" className="navbar-cart-btn">
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && <span className="navbar-cart-badge">{cartItemsCount}</span>}
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="navbar-mobile md:hidden">
            <Link to="/Velora/cart" className="navbar-cart-btn">
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && <span className="navbar-cart-badge">{cartItemsCount}</span>}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="navbar-mobile-menu-btn">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="navbar-mobile-menu md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`navbar-mobile-nav-item ${isActiveLink(item.path) ? 'active' : ''}`}
              >
                {item.name}
              </Link>
            ))}

            {user ? (
              <>
                <Link to="/Velora/profile" className="navbar-mobile-nav-item">Profile</Link>
                <Link to="/Velora/dashboard" className="navbar-mobile-nav-item">Dashboard</Link>
                <Link to="/Velora/orders" className="navbar-mobile-nav-item">Orders</Link>
                <Link to="/Velora/settings" className="navbar-mobile-nav-item">Settings</Link>
                <button className="navbar-mobile-logout-btn" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link to="/Velora/login" className="navbar-mobile-login-btn" onClick={() => setIsMenuOpen(false)}>
                Login / Signup
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
