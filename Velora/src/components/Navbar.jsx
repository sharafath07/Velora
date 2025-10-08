import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User, ChevronDown, LogOut, Settings as SettingsIcon, LayoutDashboard, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { getCartItemsCount } = useCart();
  const { state: authState, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const cartItemsCount = getCartItemsCount();
  const userMenuRef = useRef(null);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            Velora
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

            {/* Auth Button/User Menu */}
            {authState.isAuthenticated && authState.user ? (
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
                        {authState.user.firstName[0]}{authState.user.lastName[0]}
                      </div>
                      <div className="navbar-dropdown-user-info">
                        <p className="navbar-dropdown-name">
                          {authState.user.firstName} {authState.user.lastName}
                        </p>
                        <p className="navbar-dropdown-email">
                          {authState.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="navbar-dropdown-divider"></div>
                    <Link
                      to="/profile"
                      className="navbar-dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="navbar-dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    <Link
                      to="/orders"
                      className="navbar-dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package size={16} />
                      Orders
                    </Link>
                    <Link
                      to="/settings"
                      className="navbar-dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <SettingsIcon size={16} />
                      Settings
                    </Link>
                    <div className="navbar-dropdown-divider"></div>
                    <button
                      className="navbar-dropdown-item logout"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="navbar-login-btn">
                Login / Signup
              </Link>
            )}

            <Link to="/cart" className="navbar-cart-btn">
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
            <Link to="/cart" className="navbar-cart-btn">
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
                {authState.isAuthenticated && authState.user ? (
                  <>
                    <Link
                      to="/profile"
                      className="navbar-mobile-nav-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="navbar-mobile-nav-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/orders"
                      className="navbar-mobile-nav-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      to="/settings"
                      className="navbar-mobile-nav-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      className="navbar-mobile-logout-btn"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="navbar-mobile-login-btn"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login / Signup
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;