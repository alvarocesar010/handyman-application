"use client";

import { useEffect, useState } from "react";
import { Edit3, Trash2, Package } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { SupplyDB } from "@/types/supplies/supplies";

// Create a local interface that extends SupplyDB to include the ID from the database
interface SupplyWithId extends SupplyDB {
  id?: string;
  _id?: string; // Adding _id in case your backend uses MongoDB naming
}

interface RecentSuppliesListProps {
  onEdit: (id: string) => void;
  refreshTrigger: boolean;
}

export default function RecentSuppliesList({
  onEdit,
  refreshTrigger,
}: RecentSuppliesListProps) {
  const [items, setItems] = useState<SupplyWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecent();
  }, [refreshTrigger]);

  async function fetchRecent() {
    try {
      const res = await fetch("/api/admin/supplies?limit=5");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Error loading recent items:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`/api/admin/supplies?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      // Filter out using whichever ID property is present
      setItems((prev) => prev.filter((item) => (item.id || item._id) !== id));
      toast.success("Item removed");
    } catch (error) {
      console.error(error);
      toast.error("Could delete item");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 text-slate-400 animate-pulse">
        Loading recent entries...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
        Recently Added
      </h3>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-sm">
            No items added yet.
          </div>
        ) : (
          items.map((item) => {
            // Determine which ID to use safely
            const itemId = item.id || item._id;

            return (
              <div
                key={itemId}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:border-[#007b9e]/30 transition-colors"
              >
                <div className="relative w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100">
                  {item.photos && item.photos[0] ? (
                    <Image
                      src={item.photos[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Package size={20} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#002d5a] truncate">
                    {item.name}
                  </h4>
                  <div className="flex gap-2 items-center mt-1">
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-medium lowercase">
                      {item.category}
                    </span>
                    {item.color && (
                      <span className="text-[10px] text-slate-400">
                        • {item.color}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => itemId && onEdit(itemId)}
                    className="p-2 text-slate-400 hover:text-[#007b9e] hover:bg-cyan-50 rounded-lg transition-colors"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => itemId && handleDelete(itemId)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
