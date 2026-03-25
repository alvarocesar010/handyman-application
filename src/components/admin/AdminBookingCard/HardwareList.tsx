"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Store,
  ExternalLink,
  Save,
} from "lucide-react";
import { toast } from "react-toastify";

/* ---------- TYPES ---------- */
type Inventory = { size: string; qty: number; _id: string };
type StoreEntry = {
  storeName: string;
  link: string;
  price: number;
  inventory: Inventory[];
};
type Supply = {
  _id: string;
  name: string;
  photos: string[];
  storeEntries: StoreEntry[];
};
export type SelectedItem = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
  link?: string;
  storeName?: string;
  stockQty: number;
  size: string;
  inventoryId: string;
};

type Props = { bookingId: string; initialSupplies?: SelectedItem[] };

export default function HardwareList({ bookingId, initialSupplies }: Props) {
  const [items, setItems] = useState<Supply[]>([]);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedItem[]>(
    initialSupplies ?? [],
  );
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/api/admin/supplies")
      .then((res) => res.json())
      .then(setItems);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    if (!search) return items;
    return items.filter((i) =>
      i.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [items, search]);

  function handleAdd(item: Supply) {
    const entry = item.storeEntries?.[0];
    const inventoryItem = entry?.inventory?.[0]; // Pega o primeiro tamanho disponível

    const newItem: SelectedItem = {
      _id: item._id,
      name: item.name,
      price: entry?.price ?? 0,
      image: item.photos?.[0],
      link: entry?.link,
      storeName: entry?.storeName,
      size: inventoryItem?.size,
      inventoryId: inventoryItem._id,
      stockQty: entry?.inventory?.reduce((acc, i) => acc + i.qty, 0) ?? 0,
      qty: qtyMap[item._id] || 1,
    };
    setIsOpen(false);

    setSelected((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      if (exists)
        return prev.map((i) =>
          i._id === item._id ? { ...i, qty: i.qty + newItem.qty } : i,
        );
      return [...prev, newItem];
    });
    setQtyMap((p) => ({ ...p, [item._id]: 1 }));
  }

  const total = useMemo(
    () => selected.reduce((acc, i) => acc + i.price * i.qty, 0),
    [selected],
  );
  const hasChanges = useMemo(
    () => JSON.stringify(selected) !== JSON.stringify(initialSupplies),
    [selected, initialSupplies],
  );

  // Inside HardwareList.tsx
  // src/components/admin/AdminBookingCard/HardwareList.tsx

  async function handleSave() {
    setLoading(true);

    try {
      // 🔍 Validate before sending (important)
      const payload = {
        id: bookingId,
        supplies: selected.map((item) => {
          if (!item.inventoryId) {
            throw new Error(`Missing inventoryId for ${item.name}`);
          }

          return {
            _id: item._id,
            inventoryId: item.inventoryId,
            qty: item.qty,
            name: item.name,
            price: item.price,
            image: item.image,
            link: item.link,
            storeName: item.storeName,
            size: item.size,
            stockQty: item.stockQty,
          };
        }),
      };


      const res = await fetch("/api/admin/bookings/hardwareUpdate", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update hardware");
      }

      // ✅ Success
      toast.success(data.message || "Hardware updated successfully");
    } catch (err) {
      console.error("SAVE ERROR:", err);

      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <div
      ref={containerRef}
      className="w-full max-w-4xl mx-auto flex flex-col gap-8 antialiased"
    >
      {/* HEADER & SEARCH SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            value={search}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items to add..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all outline-none"
          />

          {isOpen && filtered.length > 0 && (
            <div className="absolute top-full mt-3 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-80 overflow-y-auto z-50 p-2 animate-in fade-in slide-in-from-top-2">
              {filtered.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleAdd(item)}
                  className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group"
                >
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-slate-100 relative">
                    {item.photos?.[0] && (
                      <Image
                        src={item.photos?.[0]}
                        alt=""
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      €{item.storeEntries?.[0]?.price ?? 0} •{" "}
                      {item.storeEntries?.[0]?.storeName}
                    </p>
                  </div>
                  <Plus
                    size={20}
                    className="text-slate-300 group-hover:text-slate-900"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SUMMARY CARD (TOP) */}
        <div className="bg-slate-200 px-6 py-3 rounded-md flex items-center justify-center gap-6 shadow-lg border border-slate-800">
          <div className="flex flex-col items-center justify-center">
            <p className="text-[10px] uppercase font-bold text-slate-900 tracking-widest text-center">
              Selected Items
            </p>
            <p className="text-lg font-black">{selected.length}</p>
          </div>
          <div className="h-8 w-[1px] bg-slate-900" />
          <div className="flex flex-col items-center justify-center">
            <p className="text-[10px] uppercase font-bold text-slate-900 tracking-widest text-center">
              Total Estimate
            </p>
            <p className="text-lg font-black text-emerald-700">
              €{total.toFixed(2)}
            </p>
          </div>
          <div className="h-8 w-[1px] bg-slate-900" />

          {/* SAVE ACTION (BOTTOM STICKY) */}
          {hasChanges && (
            <div className="sticky bottom-6 flex justify-center animate-in slide-in-from-bottom-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-3 text-[10px] bg-slate-900 hover:bg-slate-800 text-white px-2 py-2 rounded-md font-black  transition-all shadow-2xl disabled:opacity-50 hover:scale-105 active:scale-95"
              >
                <Save size={22} />
                {loading ? "SAVING CHANGES..." : "SAVE"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ITEMS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {selected.length === 0 ? (
          <div className="lg:col-span-2 py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
            No supplies added to this quote yet.
          </div>
        ) : (
          selected.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="relative h-20 w-20 flex-shrink-0 shadow-inner rounded-xl overflow-hidden border border-slate-50">
                {item.image && (
                  <Image
                    src={item.image || ""}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <h4 className="font-extrabold text-slate-900 truncate pr-4">
                  {item.name}
                </h4>

                <div className="flex flex-wrap items-center gap-2">
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-colors"
                    >
                      <Store size={12} /> {item.storeName}{" "}
                      <ExternalLink size={10} />
                    </a>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-400 text-[10px] font-bold inline-flex items-center gap-1.5">
                      <Store size={12} /> {item.storeName}
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold uppercase tracking-tight ${item.stockQty > 0 ? "text-emerald-600" : "text-rose-500"}`}
                  >
                    {item.stockQty > 0
                      ? `• ${item.stockQty} In Stock`
                      : "• Order Needed"}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-100 shadow-inner">
                    <button
                      onClick={() =>
                        setSelected((p) =>
                          p.map((i) =>
                            i._id === item._id
                              ? { ...i, qty: Math.max(1, i.qty - 1) }
                              : i,
                          ),
                        )
                      }
                      className="p-1 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-black text-sm">
                      {item.qty}
                    </span>
                    <button
                      onClick={() =>
                        setSelected((p) =>
                          p.map((i) =>
                            i._id === item._id ? { ...i, qty: i.qty + 1 } : i,
                          ),
                        )
                      }
                      className="p-1 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                      Subtotal
                    </p>
                    <p className="font-black text-slate-900">
                      €{(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  setSelected((prev) => prev.filter((i) => i._id !== item._id))
                }
                className=" group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-all ml-2"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
