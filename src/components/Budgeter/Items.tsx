"use client";
import { useContext, useEffect, useState } from "react";
import { BudgeterContext } from "@/context/budgeter";
import Image from "next/image";
import { Package } from "lucide-react";

export type InventoryItem = {
  _id: string;
  size: string;
  qty: number;
};

export type StoreEntry = {
  storeName: string;
  link: string;
  price: number;
  inventory: InventoryItem[];
};

export type Supply = {
  _id: string;
  name: string;
  description: string;
  category: string;
  serviceSlug: string;
  color?: string;
  photos: string[];
  storeEntries: StoreEntry[];
  createdAt: string;
  updatedAt?: string;
};

export default function Items() {
  const [, dispatch] = useContext(BudgeterContext);
  const [items, setItems] = useState<Supply[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "/api/admin/supplies?category=internal-doors&limit=20",
      );
      const data: Supply[] = await res.json();

      const sorted = data.sort(
        (a, b) => a.storeEntries[0].price - b.storeEntries[0].price,
      );
      setItems(sorted);
    }

    fetchData();
  }, []);

  const handleSelect = (item: Supply) => {
    setSelectedId(item._id);

    dispatch({
      type: "SELECT_SUPPLY",
      payload: {
        _id: item._id,
        name: item.name,
        price: item.storeEntries[0].price,
        photo: item.photos?.[0],
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col px-3 py-6">
      {/* Title */}
      <div className="text-center mb-6">
        <p className="text-xl font-semibold text-slate-900">Choose your door</p>
        <p className="text-sm text-slate-500">Select one option to continue</p>
      </div>

      {/* Items */}
      <div className="grid gap-4">
        {items.map((item) => {
          const isSelected = selectedId === item._id;

          return (
            <button
              key={item._id}
              onClick={() => handleSelect(item)}
              className={`flex items-center gap-4 w-full p-4 rounded-xl border transition text-left
                ${
                  isSelected
                    ? "border-cyan-600 bg-cyan-50"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }`}
            >
              {/* Image */}
              <div className="w-20 h-20 relative bg-slate-50 rounded-lg border overflow-hidden flex items-center justify-center">
                {item.photos?.[0] ? (
                  <Image
                    src={item.photos[0]}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <Package className="text-slate-300" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{item.name}</p>
                <p className="text-sm text-slate-500 mt-1">
                  €{item.storeEntries[0].price.toFixed(2)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-between mt-6">
        <button
          className="bg-slate-200 text-slate-700 py-2 px-4 rounded-xl"
          onClick={() => dispatch({ type: "PREVIOUS" })}
        >
          Back
        </button>

        <button
          disabled={!selectedId}
          className={`py-2 px-4 rounded-xl font-medium transition ${
            selectedId
              ? "bg-cyan-600 text-white"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
          // onClick={() =>
          //   dispatch({
          //     type: "SELECT_SUPPLY",
          //     payload: items.find((i) => i._id === selectedId),
          //   })
          // }
        >
          Next
        </button>
      </div>
    </div>
  );
}
