"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Trash2,
  Edit,
  ExternalLink,
  Package,
  Layers,
  Palette,
  Calendar,
  X,
  Store,
} from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import { SupplyDB } from "@/types/supplies/supplies";
import SupplyInput from "./SuppliesInput";

type SupplyUI = Required<
  Pick<SupplyDB, "_id" | "photos" | "createdAt" | "updatedAt">
> &
  SupplyDB;

export default function SuppliesDashboard() {
  const [items, setItems] = useState<SupplyUI[]>([]);
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchItems();
    const refresh = () => fetchItems();
    window.addEventListener("supplies-updated", refresh);
    return () => window.removeEventListener("supplies-updated", refresh);
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/supplies");
      const data: SupplyDB[] = await res.json();
      const formatted = data.map((item) => ({
        ...item,
        _id: item._id ?? Math.random().toString(),
        photos: item.photos ?? [],
        createdAt: item.createdAt ?? new Date().toISOString(),
        updatedAt: item.updatedAt ?? new Date().toISOString(),
      })) as SupplyUI[];
      setItems(formatted);
    } catch {
      toast.error("Failed to load items");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete item?")) return;
    try {
      const res = await fetch(`/api/admin/supplies?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item._id !== id));
        toast.success("Deleted");
      }
    } catch {
      toast.error("Error deleting");
    }
  };

  const filteredItems = useMemo(() => {
    const s = search.toLowerCase();
    return items.filter(
      (i) =>
        i.name.toLowerCase().includes(s) ||
        i.category.toLowerCase().includes(s),
    );
  }, [items, search]);

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 space-y-4 bg-slate-50/50 min-h-screen">
      {/* HEADER - Sleek and less round */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-600 p-2 rounded-lg text-white">
            <Package size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Supply Inventory
          </h1>
        </div>

        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            placeholder="Search name, color, category..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none text-sm transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ITEM LIST */}
      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-cyan-300 transition-colors"
          >
            <div className="flex flex-col md:flex-row">
              {/* IMAGE: Fixed width on desktop, flexible on mobile */}
              <div className="md:w-48 lg:w-56 bg-slate-50/50 p-4 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
                <div
                  className="relative w-32 h-32 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden cursor-zoom-in transition-transform hover:scale-105"
                  onClick={() =>
                    item.photos?.[0] && setSelectedImage(item.photos[0])
                  }
                >
                  {item.photos?.[0] ? (
                    <Image
                      src={item.photos[0]}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Package size={32} />
                    </div>
                  )}
                </div>
              </div>

              {/* CONTENT AREA: Uses all available space */}
              <div className="flex-1 p-5 flex flex-col min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded text-[10px] font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                      <span className="text-slate-400 text-[10px] font-mono">
                        #{item._id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => {
                        setEditingId(item._id);
                        setIsModalOpen(true);
                      }}
                      className="p-2 hover:bg-slate-100 text-slate-400 hover:text-cyan-600 rounded-md transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                {/* TITLE: Clamped to 2 lines to prevent layout breaking */}
                <h2 className="text-lg font-bold text-slate-800 ">
                  {item.name}
                </h2>

                {/* DESCRIPTION: Fixed height with scroll for overflow */}
                <div className="mb-4 bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-slate-600 text-xs leading-relaxed max-h-25 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-2 italic">
                    {item.description}
                  </p>
                </div>

                {/* INFO GRID: Tightened spacing */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-3 border-t border-slate-100 mb-4">
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase mb-1">
                      <Palette size={12} /> Color
                    </span>
                    <p className="text-xs font-semibold text-slate-700 truncate">
                      {item.color || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase mb-1">
                      <Layers size={12} /> Service
                    </span>
                    <p className="text-xs font-semibold text-slate-700 truncate">
                      {item.serviceSlug || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase mb-1">
                      <Calendar size={12} /> Logged
                    </span>
                    <p className="text-xs font-semibold text-slate-700">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase mb-1">
                      <Store size={12} /> Stockists
                    </span>
                    <p className="text-xs font-semibold text-slate-700">
                      {item.storeEntries.length} Sources
                    </p>
                  </div>
                </div>

                {/* VENDORS: List style for better horizontal space use */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {item.storeEntries.map((store, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-white border border-slate-200 pl-3 pr-1 rounded-lg group/price hover:border-cyan-500 transition-all"
                    >
                      <div className="py-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">
                          {store.storeName}
                        </p>
                        <p className="text-sm font-bold text-slate-900 leading-none">
                          €{Number(store.price).toFixed(2)}
                        </p>
                      </div>
                      {store.link && (
                        <a
                          href={store.link}
                          target="_blank"
                          className="p-1.5 text-slate-300 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-all"
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-2xl bg-white rounded-xl overflow-hidden shadow-2xl">
            <button className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full text-slate-800 hover:bg-red-500 hover:text-white transition-all">
              <X size={20} />
            </button>
            <div className="relative h-[60vh] w-full">
              <Image
                src={selectedImage}
                alt="Preview"
                fill
                className="object-contain p-8"
              />
            </div>
          </div>
        </div>
      )}

      {/* EDIT / CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            {/* Close button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditingId(null);
              }}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 z-10"
            >
              <X size={20} />
            </button>
            
           <div className="p-6">
              <SupplyInput 
                initialData={items.find((i) => i._id === editingId)} 
                onSuccess={() => {
                  setIsModalOpen(false);
                  setEditingId(null);
                  fetchItems(); // Refresh the list automatically
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
