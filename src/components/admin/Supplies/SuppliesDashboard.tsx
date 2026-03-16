"use client";
import { useState, useEffect, useMemo } from "react";
import { Search, Trash2, Edit, ExternalLink, Package, X } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

interface SupplyItem {
  _id: string;
  name: string;
  category: string;
  store: string;
  price: number;
  description: string;
  link?: string;
  createdAt: string;
  photos: string[];
}

export default function SuppliesDashboard() {
  const [items, setItems] = useState<SupplyItem[]>([]);
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<SupplyItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/supplies");
      const data = await res.json();
      setItems(data);
    } catch {
      toast.error("Failed to load items");
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const res = await fetch(`/api/supplies?id=${editingItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i._id === editingItem._id ? editingItem : i)),
        );
        setEditingItem(null);
        toast.success("Item updated successfully");
      }
    } catch {
      toast.error("Failed to update item");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`/api/supplies?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item._id !== id));
        toast.success("Item removed");
      }
    } catch {
      toast.error("Error deleting item");
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(
      (item: SupplyItem) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.store.toLowerCase().includes(search.toLowerCase()),
    );
  }, [items, search]);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="text-cyan-700" size={28} /> Inventory & Prices
        </h1>
        <div className="relative w-full md:w-64">
          <Search
            className="absolute left-3 top-2.5 text-slate-400"
            size={18}
          />
          <input
            placeholder="Search items..."
            className="w-full pl-10 p-2 border rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Edit Item</h2>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Item Name
                </label>
                <input
                  className="w-full p-2 border rounded-lg mt-1"
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Price (€)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-lg mt-1"
                    value={editingItem.price}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Store
                  </label>
                  <input
                    className="w-full p-2 border rounded-lg mt-1"
                    value={editingItem.store}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, store: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Description
                </label>
                <textarea
                  className="w-full p-2 border rounded-lg mt-1"
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-700 text-white py-2 rounded-lg font-bold hover:bg-cyan-800 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 bg-slate-100 py-2 rounded-lg font-medium hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item: SupplyItem) => (
            <div
              key={item._id}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-xs font-medium text-cyan-600">
                      {item.store}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {item.name}
                  </h3>
                  <p className="text-sm text-slate-500">{item.description}</p>

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline mt-2"
                    >
                      <ExternalLink size={12} /> View Product Page
                    </a>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {item.photos?.map((path, index) => (
                    <Image
                      key={`${path}-${index}`}
                      src={path}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  ))}
                </div>

                <div className="flex md:flex-col justify-between items-end gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900">
                      €{item.price}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Saved: {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
            No items found matching &quot;{search}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
