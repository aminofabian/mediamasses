'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PriceType } from '@prisma/client';


export type CartItem = {
  id: string;
  price: number;
  quantity: number;
  currency: string;
  name: string;
  priceType: string;
  targetUrl?: string;
  paymentMethod?: string;
  
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  useEffect(() => {
    // Load cart from localStorage on component mount
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);
  
  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id && i.priceType === item.priceType);
      if (existing) {
        return prev.map(i => i.id === item.id && i.priceType === item.priceType ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
  };
  
  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };
  
  const clearCart = () => {
    setCartItems([]);
  };
  
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartTotal }}>
    {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
