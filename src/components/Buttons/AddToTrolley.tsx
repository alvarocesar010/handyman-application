"use client";

import { Supply } from "@/lib/store/types";
import { ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import QuantitySelector from "./QuantitySelector";

type Props = {
  item: Supply;
};

export default function AddToTrolley({ item }: Props) {
  const [qty, setQty] = useState(1);
  const [addItem, setAddItem] = useState(false);
  const { addToCart } = useCart();

  return (
    <div className="flex gap-2 my-4  ">
      {/* Add or remove button */}
      <div className="h-14 flex gap-3 flex-row w-full">
        <QuantitySelector value={qty} onChange={setQty} size="full" />

        <button
          onClick={() => {
            addToCart(item, qty);
            setAddItem(true);
          }}
          className="flex cursor-pointer justify-center gap-4 p-4 w-full bg-green-600 text-white text-center rounded-lg font-semibold hover:bg-green-700 transition"
        >
          <ShoppingCart />
          Add to trolley
        </button>
      </div>

      {/* Checkout of the Trolley */}
      {addItem && (
        <div className="fixed backdrop-none inset-0 z-50 bg-black/60 flex md:items-center md:justify-center">
          <div className="fixed h-[80%] bg-slate-50 bottom-0 w-full md:w-1/2 md:h-full p-2">
            <div className="flex flex-col items-center mt-4 border-b border-b-slate-600">
              <button onClick={() => setAddItem((i) => !i)}>
                <X
                  size={36}
                  color="red"
                  className="bg-red-200 rounded-full p-0.5 absolute right-4 top-4"
                />
              </button>
              <Image
                width={120}
                height={120}
                alt={item.name}
                src={item.photos?.[0]}
                className="max-h-[120px] w-auto"
              />
              <p className="text-center font-semibold">
                You added{" "}
                <span className="font-bold">
                  {qty} {qty === 1 ? "unit" : "units"}
                </span>{" "}
                of <span className="font-medium">{item.name}</span> to your
                trolley
              </p>
              <div className="flex flex-col gap-2 w-full items-center justify-center my-4">
                <button
                  onClick={() => setAddItem(false)}
                  className="cursor-pointer bg-cyan-700 w-2/3 text-center border-white border-1 text-white font-semibold p-4 rounded-lg shadow-sm shadow-cyan-600"
                >
                  Continue Shopping
                </button>
                <Link
                  href={"/store/trolley"}
                  className="cursor-pointer bg-emerald-700 w-2/3 text-center border-1 border-white text-white font-semibold p-4 rounded-lg shadow-sm shadow-cyan-600"
                >
                  Go to trolley
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
