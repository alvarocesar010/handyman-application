"use client";

import { useState, useRef, useEffect } from "react";
import { Trash2, Plus, X, Edit3, Package } from "lucide-react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";

/** * Strict Type Definitions
 */
interface Category {
  value: string;
  sizes: string[];
}

interface InventoryItem {
  size: string;
  qty: string;
}

interface StoreEntry {
  storeName: string;
  link: string;
  price: string;
  inventory: InventoryItem[];
}

interface SupplyItem {
  _id?: string;
  name: string;
  description: string;
  category: string;
  color: string;
  storeEntries: StoreEntry[];
  localPreview?: string; // For the "Recently Added" UI
}

interface APIOptionsResponse {
  stores: string[];
  categories: Category[];
}

export default function SupplyInput() {
  const [stores, setStores] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addedItems, setAddedItems] = useState<SupplyItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<SupplyItem>({
    name: "",
    description: "",
    category: "",
    color: "",
    storeEntries: [
      {
        storeName: "",
        link: "",
        price: "",
        inventory: [{ size: "", qty: "" }],
      },
    ],
  });

  const selectedCategory = categories.find(
    (c) => c.value === formData.category,
  );
  const availableSizes = selectedCategory?.sizes ?? [];

  useEffect(() => {
    loadOptions();
  }, []);

  async function loadOptions(): Promise<void> {
    try {
      const res = await fetch("/api/admin/supplies/options");
      const data: APIOptionsResponse = await res.json();
      setStores(data.stores);
      setCategories(data.categories);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load options");
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 5) {
      toast.warning("Maximum 5 photos allowed");
      return;
    }
    const newFiles = [...files, ...selectedFiles];
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const removePhoto = (index: number): void => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const updateStoreField = (
    sIdx: number,
    field: keyof Omit<StoreEntry, "inventory">,
    value: string,
  ): void => {
    setFormData((prev) => {
      const updatedEntries = [...prev.storeEntries];
      updatedEntries[sIdx] = { ...updatedEntries[sIdx], [field]: value };
      return { ...prev, storeEntries: updatedEntries };
    });
  };

  const updateInventory = (
    sIdx: number,
    iIdx: number,
    field: keyof InventoryItem,
    value: string,
  ): void => {
    const updatedEntries = [...formData.storeEntries];
    updatedEntries[sIdx].inventory[iIdx][field] = value;
    setFormData({ ...formData, storeEntries: updatedEntries });
  };

  const removeInventoryRow = (sIdx: number, iIdx: number): void => {
    const updatedEntries = [...formData.storeEntries];
    updatedEntries[sIdx].inventory = updatedEntries[sIdx].inventory.filter(
      (_, i) => i !== iIdx,
    );
    setFormData({ ...formData, storeEntries: updatedEntries });
  };

  const handleDelete = async (id: string, index: number): Promise<void> => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/supplies/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_ROUTE_SECRET || "",
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      setAddedItems((prev) => prev.filter((_, i) => i !== index));
      toast.success("Item removed");
    } catch (err) {
      console.error(err);
      toast.error("Could not delete item");
    }
  };

  const handleEdit = (index: number): void => {
    const item = addedItems[index];
    setFormData({ ...item });
    setEditingId(item._id || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info("Item loaded for editing");
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading(
      editingId ? "Updating item..." : "Creating item...",
    );

    try {
      const data = new FormData();
      files.forEach((file) => data.append("photos", file));
      data.append("payload", JSON.stringify(formData));

      const url = editingId
        ? `/api/admin/supplies?id=${editingId}`
        : "/api/admin/supplies";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${process.env.ADMIN_API_SECRET}`,
        },
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Operation failed");

      const savedItem: SupplyItem = {
        ...formData,
        _id: result.id || editingId,
        localPreview: previews[0], // Set the first preview for the list
      };

      if (editingId) {
        setAddedItems((prev) =>
          prev.map((item) => (item._id === editingId ? savedItem : item)),
        );
      } else {
        setAddedItems((prev) => [savedItem, ...prev]);
      }

      toast.update(loadingToast, {
        render: editingId ? "Updated!" : "Created!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Reset Form
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        category: "",
        color: "",
        storeEntries: [
          {
            storeName: "",
            link: "",
            price: "",
            inventory: [{ size: "", qty: "" }],
          },
        ],
      });
      setFiles([]);
      setPreviews([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.update(loadingToast, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-8 text-slate-900">
      <ToastContainer position="bottom-right" theme="colored" />

      <div className="max-w-2xl mx-auto space-y-8">
        <header className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="bg-[#002d5a] p-2 rounded-lg text-white">
              <Package size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[#002d5a]">
              {editingId ? "Edit Supply" : "New Supply"}
            </h2>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({
                  name: "",
                  description: "",
                  category: "",
                  color: "",
                  storeEntries: [
                    {
                      storeName: "",
                      link: "",
                      price: "",
                      inventory: [{ size: "", qty: "" }],
                    },
                  ],
                });
              }}
              className="text-xs font-bold text-red-500 uppercase hover:underline"
            >
              Cancel Edit
            </button>
          )}
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            {/* Photo Section */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Item Photos ({files.length}/5)
              </label>
              <div className="flex flex-wrap gap-3">
                {previews.map((url, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-xl border border-slate-200 overflow-hidden group"
                  >
                    <Image
                      src={url}
                      alt="preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                {files.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 bg-slate-50 hover:bg-slate-100 transition-all"
                  >
                    <Plus size={24} />
                  </button>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <input
                placeholder="Item Name"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#007b9e]"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  <option value="">Category</option>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.value}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Color / Finish"
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                />
              </div>
              <textarea
                placeholder="Description"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm min-h-[100px]"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          {/* Stores Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Store Availability
              </h3>
              <button
                type="button"
                onClick={() =>
                  setFormData((p) => ({
                    ...p,
                    storeEntries: [
                      ...p.storeEntries,
                      {
                        storeName: "",
                        link: "",
                        price: "",
                        inventory: [{ size: "", qty: "" }],
                      },
                    ],
                  }))
                }
                className="text-[#007b9e] text-xs font-bold flex items-center gap-1 hover:underline"
              >
                <Plus size={14} /> Add Source
              </button>
            </div>
            {formData.storeEntries.map((entry, sIdx) => (
              <div
                key={sIdx}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative space-y-4"
              >
                <div className="flex gap-3">
                  <select
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                    value={entry.storeName}
                    onChange={(e) =>
                      updateStoreField(sIdx, "storeName", e.target.value)
                    }
                  >
                    <option value="">Select Store</option>
                    {stores.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <div className="w-32 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3">
                    <span className="text-slate-400 text-sm">€</span>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full bg-transparent outline-none text-sm font-bold ml-1"
                      value={entry.price}
                      onChange={(e) =>
                        updateStoreField(sIdx, "price", e.target.value)
                      }
                    />
                  </div>
                </div>
                <input
                  placeholder="Product URL"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  value={entry.link}
                  onChange={(e) =>
                    updateStoreField(sIdx, "link", e.target.value)
                  }
                />

                <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                  {entry.inventory.map((inv, iIdx) => (
                    <div key={iIdx} className="flex gap-2">
                      <select
                        className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs"
                        value={inv.size}
                        onChange={(e) =>
                          updateInventory(sIdx, iIdx, "size", e.target.value)
                        }
                      >
                        <option value="">Size</option>
                        {availableSizes.map((sz) => (
                          <option key={sz} value={sz}>
                            {sz}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Qty"
                        className="w-20 p-2 bg-white border border-slate-200 rounded-lg text-xs text-center"
                        value={inv.qty}
                        onChange={(e) =>
                          updateInventory(sIdx, iIdx, "qty", e.target.value)
                        }
                      />
                      {entry.inventory.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInventoryRow(sIdx, iIdx)}
                          className="p-2 text-slate-300 hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const up = [...formData.storeEntries];
                      up[sIdx].inventory.push({ size: "", qty: "" });
                      setFormData({ ...formData, storeEntries: up });
                    }}
                    className="text-[10px] text-[#007b9e] font-bold uppercase"
                  >
                    + Add Size
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#002d5a] text-white py-4 rounded-2xl font-bold hover:bg-[#001d3d] transition-all shadow-lg shadow-blue-900/10"
          >
            {isSubmitting
              ? "Processing..."
              : editingId
                ? "Update Supply Item"
                : "Create Supply Item"}
          </button>
        </form>

        {/* Recently Added Section with Images */}
        {addedItems.length > 0 && (
          <div className="pt-10 border-t border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center">
              Recently Added
            </h3>
            <div className="grid gap-4">
              {addedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
                      {item.localPreview ? (
                        <Image
                          src={item.localPreview}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Package size={20} className="text-[#007b9e]" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-[10px] uppercase font-bold text-slate-400">
                        {item.category} • {item.storeEntries.length} Stores
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(idx)}
                      className="p-2 text-slate-400 hover:text-[#007b9e] hover:bg-blue-50 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => item._id && handleDelete(item._id, idx)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
