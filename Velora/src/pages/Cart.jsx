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
        <div className="text-center">
          <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Discover our beautiful collection of luxury clothing
          </p>
          <Link to="/Velora/shop">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">{state.items.length} items in your cart</p>
          </div>
          <Link
            to="/Velora/shop"
            className="text-primary hover:text-primary-dark flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {state.items.map((item) => (
              <div
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex items-start space-x-4">
                  <Link to={`/Velora/product/${item.id}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md hover:opacity-75 transition"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/Velora/product/${item.id}`}
                      className="font-semibold text-lg text-gray-900 hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>Size: {item.selectedSize}</span>
                      <span>Color: {item.selectedColor}</span>
                    </div>
                    <p className="font-bold text-lg text-gray-900 mt-2">${item.price}</p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}

            <div className="text-right">
              <button
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-red-500"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="font-semibold text-xl text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {state.total >= 200 ? 'Free' : '$15.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${(state.total * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-xl text-primary">
                    ${(state.total + (state.total >= 200 ? 0 : 15) + state.total * 0.08).toFixed(2)}
                  </span>
                </div>
              </div>

              {state.total < 200 && (
                <div className="bg-primary-light p-3 rounded-md mb-6 text-center">
                  <p>
                    Add <strong>${(200 - state.total).toFixed(2)}</strong> more for free shipping! 🚚
                  </p>
                </div>
              )}

              <Button className="w-full py-3 mb-4" size="lg">
                Proceed to Checkout
              </Button>

              <Link to="/Velora/shop" className="block text-center">
                <Button variant="outline" className="w-full py-3 mb-4">
                  Continue Shopping
                </Button>
              </Link>

              <div className="text-sm text-center text-gray-600">
                Secure payments via VISA, MasterCard, PayPal & more
                <p className="text-xs text-gray-500 mt-4">
                  Questions? Contact us at support@velora.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
