"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";

export default function AddCategoryButton() {
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/store", {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to create");

      // Reload to show the new empty card in the list
      window.location.reload();
    } catch (err) {
      alert("Error creating category");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCreate}
      disabled={loading}
      className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Plus className="w-5 h-5" />
      )}
      Add New Category
    </button>
  );
}
