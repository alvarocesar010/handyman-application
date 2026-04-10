"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Supply } from "@/lib/store/types";

type CartItem = {
  item: Supply;
  qty: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Supply, qty: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  totalQty: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(item: Supply, qty: number) {
    setCart((prev) => {
      const existing = prev.find((p) => p.item._id === item._id);

      if (existing) {
        return prev.map((p) =>
          p.item._id === item._id ? { ...p, qty: p.qty + qty } : p,
        );
      }

      return [...prev, { item, qty }];
    });
  }

  function updateQty(id: string, qty: number) {
    setCart((prev) => {
      if (qty < 1) {
        return prev.filter((p) => p.item._id !== id);
      }

      return prev.map((p) => (p.item._id === id ? { ...p, qty } : p));
    });
  }

  function removeItem(id: string) {
    setCart((prev) => prev.filter((p) => p.item._id !== id));
  }

  const totalQty = cart.reduce((acc, i) => acc + i.qty, 0);

  const totalPrice = cart.reduce(
    (acc, i) => acc + i.qty * i.item.sellingPrice,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQty,
        removeItem,
        totalQty,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
