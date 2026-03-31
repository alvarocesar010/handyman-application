"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Trash2,
  Edit,
  ExternalLink,
  Package,
  Layers,
  Palette,
  Calendar,
  X,
  Store,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import { SupplyDB } from "@/types/supplies/supplies";
import SupplyInput from "./SuppliesInput";
import BackToTop from "@/components/Buttons/BackToTop";

// IMPORTANT: Adjust this import path based on where you saved FilterBar.tsx
import FilterBar, { FilterGroup } from "@/components/Filters/FilterBar";

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

  // STATES FOR FILTERS AND PAGINATION
  const [sortBy, setSortBy] = useState("latest");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(""); // New state for category filter

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

  const getTotalStock = (item: SupplyUI) => {
    return item.storeEntries.reduce((total, store) => {
      return total + store.inventory.reduce((sum, inv) => sum + (Number(inv.qty) || 0), 0);
    }, 0);
  };

  const getLowestPrice = (item: SupplyUI) => {
    if (!item.storeEntries.length) return 0;
    return Math.min(...item.storeEntries.map(s => Number(s.price) || 0));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy, itemsPerPage, selectedCategory]);

  // Extract unique categories dynamically for the filter dropdown
  const uniqueCategories = useMemo(() => {
    const cats = new Set(items.map(i => i.category).filter(Boolean));
    return Array.from(cats).map(c => ({ value: c, label: c }));
  }, [items]);

  // SMART FILTERING AND SORTING
  const processedItems = useMemo(() => {
    let result = items;

    // 1. Filter by Category Dropdown
    if (selectedCategory) {
      result = result.filter(i => i.category === selectedCategory);
    }

    // 2. Filter by Search Text
    const s = search.toLowerCase();
    if (s) {
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(s) ||
          i.color?.toLowerCase().includes(s)
      );
    }

    // 3. Sort
    switch (sortBy) {
      case "latest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "az":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "stock-low":
        result.sort((a, b) => getTotalStock(a) - getTotalStock(b));
        break;
      case "price-low":
        result.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
        break;
    }

    return result;
  }, [items, search, sortBy, selectedCategory]);

  // PAGINATION LOGIC
  const totalPages = itemsPerPage === 9999 ? 1 : Math.ceil(processedItems.length / itemsPerPage);
  const currentItems = itemsPerPage === 9999 
    ? processedItems 
    : processedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // CONFIGURATION FOR DYNAMIC FILTERS (Passed to the new component)
  const inventoryFilters: FilterGroup[] = [
    {
      id: "category",
      placeholder: "All Categories",
      options: uniqueCategories,
      value: selectedCategory,
      onChange: setSelectedCategory,
    }
  ];

  const sortOpts = [
    { value: "latest", label: "Latest Added" },
    { value: "az", label: "Name (A-Z)" },
    { value: "stock-low", label: "Lowest Stock" },
    { value: "price-low", label: "Lowest Price" },
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 space-y-4 bg-slate-50/50 min-h-screen">
      
      {/* HEADER WITH NEW REUSABLE FILTER BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-cyan-600 p-2 rounded-lg text-white">
            <Package size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Supply Inventory
          </h1>
        </div>

        {/* OUR NEW REUSABLE COMPONENT IN ACTION! */}
        <FilterBar 
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search name, color..."
          filters={inventoryFilters}
          sortOptions={sortOpts}
          sortValue={sortBy}
          onSortChange={setSortBy}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-2">
        <p>Showing {currentItems.length} of {processedItems.length} items</p>
      </div>

      {/* ITEM LIST */}
      <div className="grid gap-4">
        {currentItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-cyan-300 transition-colors"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-48 lg:w-56 bg-slate-50/50 p-4 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
                <div
                  className="relative w-32 h-32 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden cursor-zoom-in transition-transform hover:scale-105"
                  onClick={() => item.photos?.[0] && setSelectedImage(item.photos[0])}
                >
                  {item.photos?.[0] ? (
                    <Image src={item.photos[0]} alt={item.name} fill className="object-contain p-2" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Package size={32} />
                    </div>
                  )}
                </div>
              </div>

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
                
                <h2 className="text-lg font-bold text-slate-800 ">{item.name}</h2>

                <div className="mb-4 bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-slate-600 text-xs leading-relaxed max-h-25 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-2 italic">
                    {item.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-3 border-t border-slate-100 mb-4">
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase mb-1">
                      <Palette size={12} /> Color
                    </span>
                    <p className="text-xs font-semibold text-slate-700 truncate">{item.color || "N/A"}</p>
                  </div>
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase mb-1">
                      <Layers size={12} /> Service
                    </span>
                    <p className="text-xs font-semibold text-slate-700 truncate">{item.serviceSlug || "N/A"}</p>
                  </div>
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase mb-1">
                      <Calendar size={12} /> Logged
                    </span>
                    <p className="text-xs font-semibold text-slate-700">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase mb-1">
                      <Store size={12} /> Stockists
                    </span>
                    <p className="text-xs font-semibold text-slate-700">{item.storeEntries.length} Sources</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {item.storeEntries.map((store, idx) => {
                    const storeStock = store.inventory.reduce((sum, inv) => sum + (Number(inv.qty) || 0), 0);

                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-3 bg-white border border-slate-200 pl-3 pr-1 rounded-lg group/price hover:border-cyan-500 transition-all"
                      >
                        <div className="py-1">
                          <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1 flex items-center gap-1">
                            {store.storeName}
                            <span className={storeStock > 0 ? "text-green-500" : "text-red-400"}>
                              • {storeStock > 0 ? `${storeStock} IN STOCK` : "OUT OF STOCK"}
                            </span>
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
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-xl border border-slate-200 mt-4 gap-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 bg-slate-50 text-slate-600 font-bold text-sm rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} /> Prev
            </button>

            <div className="flex items-center gap-1 overflow-x-auto max-w-[50vw] hide-scrollbar">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => Math.abs(currentPage - page) <= 2 || page === 1 || page === totalPages)
                .map((page, index, array) => {
                  const showEllipsis = index > 0 && page - array[index - 1] > 1;

                  return (
                    <div key={page} className="flex items-center gap-1">
                      {showEllipsis && <span className="px-2 text-slate-400">...</span>}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all px-2 ${
                          currentPage === page
                            ? "bg-cyan-600 text-white shadow-md"
                            : "text-slate-600 hover:bg-slate-100 bg-white border border-transparent hover:border-slate-200"
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  );
                })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 bg-slate-50 text-slate-600 font-bold text-sm rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

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

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
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
                  fetchItems();
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* OUR NEW BACK TO TOP BUTTON */}
      <BackToTop />
    </div>
  );
}