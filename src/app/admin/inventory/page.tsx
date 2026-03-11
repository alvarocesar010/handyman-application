"use client";
import { useState } from "react";
import { Plus, Link as LinkIcon } from "lucide-react";
import SuppliesDashboard from "@/components/admin/Supplies/SuppliesDashboard";

export default function SupplyManager() {
  const [stores, setStores] = useState(["B&Q", "Screwfix", "Woodies"]);
  const [categories, setCategories] = useState([
    "Plumbing",
    "Bathroom",
    "Tools",
  ]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    store: stores[0],
    description: "",
    link: "",
    category: categories[0],
  });

  const handleAddOption = (type: "store" | "category") => {
    const newVal = prompt(`Enter new ${type} name:`);
    if (!newVal) return;
    if (type === "store") setStores((prev) => [...prev, newVal]);
    else setCategories((prev) => [...prev, newVal]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/supplies", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    if (res.ok) alert("Item Saved!");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 max-w-md">
      <h2 className="text-xl font-bold mb-6">Add New Supply Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Item Name"
          className="w-full p-3 border rounded-lg bg-slate-50"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <input
          type="number"
          placeholder="Price €"
          className="w-full p-3 border rounded-lg bg-slate-50"
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />

        {/* Store Dropdown */}
        <div className="flex gap-2">
          <select
            className="flex-1 p-3 border rounded-lg bg-slate-50"
            value={formData.store}
            onChange={(e) =>
              setFormData({ ...formData, store: e.target.value })
            }
          >
            {stores.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => handleAddOption("store")}
            className="p-3 bg-slate-100 rounded-lg"
          >
            <Plus size={20} />
          </button>
        </div>

        <input
          placeholder="Description (Dimensions)"
          className="w-full p-3 border rounded-lg bg-slate-50"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        {/* Link Input */}
        <div className="relative">
          <LinkIcon
            className="absolute left-3 top-3.5 text-slate-400"
            size={18}
          />
          <input
            placeholder="Product Link (URL)"
            className="w-full p-3 pl-10 border rounded-lg bg-slate-50"
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />
        </div>

        {/* Category Dropdown */}
        <div className="flex gap-2">
          <select
            className="flex-1 p-3 border rounded-lg bg-slate-50"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => handleAddOption("category")}
            className="p-3 bg-slate-100 rounded-lg"
          >
            <Plus size={20} />
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-[#007b9e] text-white py-3 rounded-xl font-bold"
        >
          Save Item
        </button>
      </form>
      <SuppliesDashboard />
    </div>
  );
}
