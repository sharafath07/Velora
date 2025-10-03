import React, { createContext, useContext, useReducer } from 'react';
import { Product } from '../data/products';

const CartContext = createContext(undefined);

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM':
            const existingItemIndex = state.items.findIndex(
                item => item.id === action.payload.id && 
                                 item.selectedSize === action.payload.selectedSize && 
                                 item.selectedColor === action.payload.selectedColor
            );
            
            if (existingItemIndex > -1) {
                const updatedItems = [...state.items];
                updatedItems[existingItemIndex].quantity += action.payload.quantity;
                return {
                    ...state,
                    items: updatedItems,
                    total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                };
            } else {
                const newItems = [...state.items, action.payload];
                return {
                    ...state,
                    items: newItems,
                    total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                };
            }
            
        case 'REMOVE_ITEM':
            const filteredItems = state.items.filter(item => item.id !== action.payload);
            return {
                ...state,
                items: filteredItems,
                total: filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
            };
            
        case 'UPDATE_QUANTITY':
            if (action.payload.quantity === 0) {
                const filteredItems = state.items.filter(item => item.id !== action.payload.id);
                return {
                    ...state,
                    items: filteredItems,
                    total: filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                };
            }
            
            const updatedItems = state.items.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: action.payload.quantity }
                    : item
            );
            return {
                ...state,
                items: updatedItems,
                total: updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
            };
            
        case 'CLEAR_CART':
            return {
                items: [],
                total: 0,
            };
            
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

    const addItem = (product, size, color, quantity) => {
        const cartItem = {
            ...product,
            quantity,
            selectedSize: size,
            selectedColor: color,
        };
        dispatch({ type: 'ADD_ITEM', payload: cartItem });
    };

    const removeItem = (id) => {
        dispatch({ type: 'REMOVE_ITEM', payload: id });
    };

    const updateQuantity = (id, quantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const getCartItemsCount = () => {
        return state.items.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider 
            value={{ 
                state, 
                dispatch, 
                addItem, 
                removeItem, 
                updateQuantity, 
                clearCart, 
                getCartItemsCount 
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
