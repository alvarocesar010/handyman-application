"use client";

import QuantitySelector from "@/components/Buttons/QuantitySelector";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export default function Trolley() {
  const { cart, updateQty, removeItem, totalPrice } = useCart();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">Your trolley</h1>

      {cart.length === 0 && (
        <p className="text-gray-500">Your trolley is empty</p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {/* LEFT - ITEMS */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {cart.map(({ item, qty }) => (
            <div
              key={item._id}
              className="flex gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm"
            >
              {/* IMAGE */}
              <div className="w-24 h-24 bg-gray-50 rounded-lg flex-shrink-0">
                <Image
                  src={item.photos?.[0]}
                  width={96}
                  height={96}
                  alt={item.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>

              {/* INFO */}
              <div className="flex flex-col flex-1 justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                    {item.name}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    €{item.sellingPrice}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity */}
                  <QuantitySelector
                    value={qty}
                    onChange={(newQty) => updateQty(item._id, newQty)}
                    size="sm"
                  />

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT - SUMMARY */}
        {cart.length > 0 && (
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-fit">
            <h2 className="text-lg font-semibold mb-4">Order summary</h2>

            {/* Subtotal */}
            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span>
              <span>€{totalPrice.toFixed(2)}</span>
            </div>

            {/* Delivery */}
            <div className="text-sm text-gray-500 mb-4">
              Delivery charges will be added at checkout (if applicable).
            </div>

            <div className="border-t my-4"></div>

            {/* Total */}
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Total</span>
              <span>€{totalPrice.toFixed(2)}</span>
            </div>

            {/* Checkout button */}
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition">
              Go to checkout
            </button>

            {/* Payment icons (simple version) */}
            <div className="flex gap-2 justify-center mt-4 text-xs text-gray-400">
              <span>VISA</span>
              <span>Mastercard</span>
              <span>PayPal</span>
              <span>Apple Pay</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
