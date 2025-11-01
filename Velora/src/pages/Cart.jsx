import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/Button';

const Cart = () => {
  const { state, removeItem, updateQuantity, clearCart } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="cart-empty min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="cart-empty-content text-center">
          <ShoppingBag size={64} className="cart-empty-icon text-gray-300 mx-auto mb-4" />
          <h2 className="cart-empty-title font-serif text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="cart-empty-description text-gray-600 mb-8">
            Discover our beautiful collection of luxury clothing
          </p>
          <Link to="/shop">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container min-h-screen bg-gray-50">
      <div className="cart-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="cart-header flex items-center justify-between mb-8">
          <div className="cart-header-info">
            <h1 className="font-serif text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">{state.items.length} items in your cart</p>
          </div>
          <Link to="/shop" className="cart-continue-shopping text-primary hover:text-primary-dark flex items-center">
            <ArrowLeft size={16} className="mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="cart-main grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="cart-items lg:col-span-2 space-y-6">
            {state.items.map((item) => (
              <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="cart-item bg-white rounded-lg shadow-sm p-6">
                <div className="cart-item-content flex items-start space-x-4">
                  
                  {/* Product Image */}
                  <Link to={`/product/${item.id}`} className="cart-item-image">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-img w-20 h-20 object-cover rounded-md hover:opacity-75 transition-opacity duration-200"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="cart-item-info flex-1 min-w-0">
                    <Link
                      to={`/product/${item.id}`}
                      className="cart-item-name font-semibold text-lg text-gray-900 hover:text-primary transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                    <p className="cart-item-category text-sm text-gray-600 mt-1">{item.category}</p>
                    <div className="cart-item-options flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>Size: {item.selectedSize}</span>
                      <span>Color: {item.selectedColor}</span>
                    </div>
                    <p className="cart-item-price font-bold text-lg text-gray-900 mt-2">${item.price}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="cart-item-quantity flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="cart-quantity-btn p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="cart-quantity-display w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="cart-quantity-btn p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="cart-item-remove p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <div className="cart-clear text-right">
              <button
                onClick={clearCart}
                className="cart-clear-btn text-sm text-gray-500 hover:text-red-500 transition-colors duration-200"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-summary lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="cart-summary-title font-semibold text-xl text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Summary Details */}
              <div className="cart-summary-details space-y-4 mb-6">
                <div className="cart-summary-row flex justify-between">
                  <span className="cart-summary-label text-gray-600">Subtotal</span>
                  <span className="cart-summary-value font-medium">${state.total.toFixed(2)}</span>
                </div>
                <div className="cart-summary-row flex justify-between">
                  <span className="cart-summary-label text-gray-600">Shipping</span>
                  <span className="cart-summary-value font-medium">
                    {state.total >= 200 ? 'Free' : '$15.00'}
                  </span>
                </div>
                <div className="cart-summary-row flex justify-between">
                  <span className="cart-summary-label text-gray-600">Tax</span>
                  <span className="cart-summary-value font-medium">${(state.total * 0.08).toFixed(2)}</span>
                </div>
                <div className="cart-summary-total border-t border-gray-200 pt-4">
                  <div className="cart-summary-row flex justify-between">
                    <span className="cart-summary-label font-semibold text-lg">Total</span>
                    <span className="cart-summary-value font-bold text-xl text-primary">
                      ${(state.total + (state.total >= 200 ? 0 : 15) + state.total * 0.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Notice */}
              {state.total < 200 && (
                <div className="cart-shipping-notice bg-primary-light p-3 rounded-md mb-6">
                  <p>
                    Add <strong>${(200 - state.total).toFixed(2)}</strong> more for free shipping!
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <Button className="cart-checkout-btn w-full py-3 mb-4" size="lg">
                Proceed to Checkout
              </Button>

              {/* Continue Shopping */}
              <Link to="/shop" className="block text-center">
                <Button variant="outline" className="cart-checkout-btn w-full py-3 mb-4">
                  Continue Shopping
                </Button>
              </Link>

              {/* Payment + Info */}
              <div className="cart-security-info space-y-3 text-sm text-center">
                <p className="cart-security-text text-gray-600">
                  Add <strong>${(200 - state.total).toFixed(2)}</strong> more for free shipping! 🚚
                </p>
                <div className="cart-payment-methods flex justify-center space-x-4">
                  <span>VISA</span>
                  <span>MASTERCARD</span>
                  <span>AMEX</span>
                  <span>PAYPAL</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Questions? Contact our customer service team at support@velora.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
