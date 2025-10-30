import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

/**
 * Product Card Component
 * Displays a single product card with image, name, price, color options, and quick add
 */
const ProductCard = ({ product, className = '' }) => {
  const { addItem } = useCart();

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const firstSize = product.sizes?.[0] || 'Default';
    const firstColor = product.colors?.[0] || 'Default';

    addItem(product, firstSize, firstColor, 1);
    alert(`${product.name} added to cart!`);
  };

  const getColorCode = (color) => {
    const colors = {
      white: '#ffffff',
      black: '#000000',
      navy: '#1e3a8a',
      gray: '#6b7280',
      beige: '#d2b48c',
      cream: '#f5f5dc',
      camel: '#c19a6b',
      burgundy: '#800020',
      emerald: '#50c878',
      blush: '#e6a5b5',
      blue: '#3b82f6',
      red: '#ef4444',
      green: '#22c55e',
      yellow: '#facc15',
    };
    return colors[color?.toLowerCase()] || '#e6a5b5';
  };

  return (
    <div
      className={`product-card transition-all duration-300 hover:shadow-lg rounded-lg overflow-hidden bg-white ${className}`}
    >
      <Link to={`/Velora/product/${product._id}`} className="block group relative">
        {/* Product Image */}
        <div className="relative w-full h-64 overflow-hidden bg-gray-100">
          <img
            src={product.image || '/placeholder.png'}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />

          {/* Wishlist Icon */}
          <div className="absolute top-3 right-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                alert('Added to wishlist 💖');
              }}
              className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-all"
            >
              <Heart size={18} className="text-gray-700" />
            </button>
          </div>

          {/* Quick Add */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all">
            <button
              onClick={handleQuickAdd}
              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700 transition"
            >
              <ShoppingCart size={16} />
              Quick Add
            </button>
          </div>

          {/* Featured Badge */}
          {product.featured && (
            <div className="absolute top-3 left-3 bg-yellow-400 text-xs font-bold text-gray-800 px-2 py-1 rounded">
              Featured
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4 text-center">
          <h3 className="font-semibold text-gray-800 text-lg truncate">{product.name}</h3>
          <p className="text-gray-500 text-sm">{product.category}</p>
          <p className="text-blue-600 font-bold mt-1">${product.price?.toFixed(2)}</p>

          {/* Color Options */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex justify-center gap-2 mt-2">
              {product.colors.slice(0, 3).map((color, idx) => (
                <div
                  key={idx}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: getColorCode(color) }}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
