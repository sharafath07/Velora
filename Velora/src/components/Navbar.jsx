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
import authService from '../api/authService';
import logo from '../assets/velora-logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(authService.getCurrentUser()); // ✅ correct

  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);
  const cartItemsCount = getCartItemsCount();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActiveLink = (path) => location.pathname === path;

  const handleLogout = () => {
    authService.logout(); // ✅ clears token and user data
    setUser(null);
    setIsUserMenuOpen(false);
    navigate('/login');
  };

  // Close dropdown when clicking outside
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
    <nav className="navbar bg-white shadow-md">
      <div className="navbar-container max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* --- Logo --- */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Velora" width={40} height={40} />
          <span className="font-bold text-lg text-gray-800">Velora</span>
        </Link>

        {/* --- Desktop Nav --- */}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`${
                isActiveLink(item.path)
                  ? 'text-primary font-semibold'
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* --- Right Icons --- */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-primary">
            <Search size={20} />
          </button>

          {/* --- User Menu --- */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                className="flex items-center space-x-1 text-gray-700 hover:text-primary"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User size={20} />
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="font-semibold">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User size={14} className="inline mr-2" /> Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LayoutDashboard size={14} className="inline mr-2" /> Dashboard
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Package size={14} className="inline mr-2" /> Orders
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <SettingsIcon size={14} className="inline mr-2" /> Settings
                  </Link>
                  <div className="border-t">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut size={14} className="inline mr-2" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-primary border border-primary px-3 py-1 rounded hover:bg-primary hover:text-white transition"
            >
              Login / Signup
            </Link>
          )}

          {/* --- Cart --- */}
          <Link to="/cart" className="relative text-gray-700 hover:text-primary">
            <ShoppingBag size={20} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full px-1">
                {cartItemsCount}
              </span>
            )}
          </Link>

          {/* --- Mobile Menu Button --- */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-primary"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* --- Mobile Nav --- */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`${
                  isActiveLink(item.path)
                    ? 'text-primary font-semibold'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-primary"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-red-600 hover:text-primary text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="text-primary font-semibold"
              >
                Login / Signup
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
