import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  items: [],
  total: 0,
};

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item =>
          item.id === action.payload.id &&
          item.selectedSize === action.payload.selectedSize &&
          item.selectedColor === action.payload.selectedColor
      );

      let updatedItems;
      if (existingItemIndex > -1) {
        updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
      } else {
        updatedItems = [...state.items, action.payload];
      }

      const updatedTotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return { ...state, items: updatedItems, total: updatedTotal };
    }

    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      const updatedTotal = filteredItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { ...state, items: filteredItems, total: updatedTotal };
    }

    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items
        .map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        )
        .filter(item => item.quantity > 0);

      const updatedTotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return { ...state, items: updatedItems, total: updatedTotal };
    }

    case 'CLEAR_CART':
      return { items: [], total: 0 };

    default:
      return state;
  }
};

// Context
const CartContext = createContext();

// Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialState,
    (initial) => {
      const saved = localStorage.getItem('cartState');
      return saved ? JSON.parse(saved) : initial;
    }
  );

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem('cartState', JSON.stringify(state));
  }, [state]);

  // Actions
  const addItem = (product, size, color, quantity) => {
    const newItem = {
      ...product,
      selectedSize: size,
      selectedColor: color,
      quantity,
    };
    dispatch({ type: 'ADD_ITEM', payload: newItem });
  };

  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const getCartItemsCount = () =>
    state.items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
