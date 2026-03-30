"use client";

import { useState, useRef, useEffect } from "react";
import { Trash2, Plus, X, Package, Edit3 } from "lucide-react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  APIOptionsResponse,
  Category,
  SupplyDB,
  StoreEntry,
  InventoryItem,
} from "@/types/supplies/supplies";

// Interface for items stored in the temporary session list
interface LocalSupply extends SupplyDB {
  tempId: string;
  _id?: string; // ✅ ADD THIS
  localPreview?: string;
}

interface OptionModalProps {
  title: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
  onSave: () => void;
}

interface SupplyInputProps {
  editingTempId?: string | null;
  onSuccess?: () => void;
}

export default function SupplyInput({
  editingTempId: initialId,
  onSuccess,
}: SupplyInputProps) {
  // Data States
  const [stores, setStores] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTempId, setEditingTempId] = useState<string | null>(
    initialId || null,
  );

  // Temporary Session List (The "Basket")
  const [addedItems, setAddedItems] = useState<LocalSupply[]>([]);

  // Photo & Form States
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal States
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [newCategoryValue, setNewCategoryValue] = useState("");
  const [newStoreValue, setNewStoreValue] = useState("");
  const [newSizeValue, setNewSizeValue] = useState("");

  const [formData, setFormData] = useState<SupplyDB>({
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
      setStores(data.stores || []);
      setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load options");
    }
  }

  // --- SESSION LIST HANDLERS ---

  const handleEditRequest = (item: LocalSupply) => {
    setEditingTempId(item._id!);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      color: item.color,
      storeEntries: JSON.parse(JSON.stringify(item.storeEntries)), // Deep clone to avoid direct mutation
    });
    setPreviews(item.localPreview ? [item.localPreview] : []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeLocalItem = (tempId: string) => {
    setAddedItems((prev) => prev.filter((item) => item.tempId !== tempId));
    toast.info("Item removed from session list");
  };

  // --- FORM HANDLERS ---

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
  ) => {
    if (value === "ADD_NEW_STORE") {
      setShowStoreModal(true);
      return;
    }
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
  ) => {
    if (value === "ADD_NEW_SIZE") {
      setShowSizeModal(true);
      return;
    }
    setFormData((prev) => {
      const updatedEntries = [...prev.storeEntries];
      updatedEntries[sIdx].inventory[iIdx][field] = value;
      return { ...prev, storeEntries: updatedEntries };
    });
  };

  const addStoreSource = () => {
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
    }));
  };

  const addInventoryRow = (sIdx: number) => {
    const up = [...formData.storeEntries];
    up[sIdx].inventory.push({ size: "", qty: "" });
    setFormData({ ...formData, storeEntries: up });
  };

  const saveOption = async (
    type: "category" | "store" | "size",
    value: string,
  ) => {
    if (!value.trim()) return;
    try {
      const res = await fetch("/api/admin/supplies/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          value,
          category: type === "size" ? formData.category : undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");

      if (type === "category") {
        setCategories((prev) => [...prev, { value, sizes: [] }]);
        setFormData((prev) => ({ ...prev, category: value }));
        setShowCategoryModal(false);
      } else if (type === "store") {
        setStores((prev) => [...prev, value].sort());
        setShowStoreModal(false);
      } else if (type === "size") {
        setCategories((prev) =>
          prev.map((c) =>
            c.value === formData.category
              ? { ...c, sizes: [...c.sizes, value] }
              : c,
          ),
        );
        setShowSizeModal(false);
      }
      toast.success(`${type} added!`);
      setNewCategoryValue("");
      setNewStoreValue("");
      setNewSizeValue("");
    } catch (err) {
      console.error(err);
      toast.error("Error saving option");
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading(
      editingTempId ? "Updating..." : "Creating...",
    );

    try {
      const data = new FormData();
      files.forEach((file) => data.append("photos", file));
      data.append("payload", JSON.stringify(formData));

      const url = editingTempId
        ? `/api/admin/supplies?id=${editingTempId}`
        : "/api/admin/supplies";
      console.log("EDITING ID:", editingTempId);
      const res = await fetch(url, {
        method: editingTempId ? "PUT" : "POST",
        body: data,
      });

      if (!res.ok) {
        const errorMsg = await res.text();
        console.error("ERRO DO BACKEND:", errorMsg);
        throw new Error(`Failed to save: ${errorMsg}`);
      }
      const result = await res.json(); // ✅ GET BACKEND ID
      // Update Local List
      const newLocalItem: LocalSupply = {
        ...formData,
        tempId: editingTempId || Date.now().toString(),
        _id: result.id || editingTempId, // ✅ THIS FIXES EVERYTHING
        localPreview: previews[0] || "",
      };

      if (editingTempId) {
        setAddedItems((prev) =>
          prev.map((it) => (it.tempId === editingTempId ? newLocalItem : it)),
        );
      } else {
        setAddedItems((prev) => [newLocalItem, ...prev]);
      }

      toast.update(loadingToast, {
        render: "Success!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      if (onSuccess) onSuccess();

      // Reset
      setEditingTempId(null);
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
      console.error(err);
      toast.update(loadingToast, {
        render: "Save failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-12">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm text-slate-900">
        <ToastContainer position="bottom-right" theme="colored" />

        <div className="max-w-2xl mx-auto space-y-8">
          <header className="flex items-center gap-3">
            <div className="bg-[#002d5a] p-2 rounded-lg text-white">
              <Package size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[#002d5a]">
              {editingTempId ? "Edit Supply" : "New Supply"}
            </h2>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photos */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Photos ({files.length}/5)
              </label>
              <div className="flex flex-wrap gap-3">
                {previews.map((url, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-xl border overflow-hidden group"
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
                      className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white"
                    >
                      <X size={18} />
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

            {/* Basic Info */}
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
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  value={formData.category}
                  onChange={(e) =>
                    e.target.value === "ADD_NEW"
                      ? setShowCategoryModal(true)
                      : setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  <option value="">Category</option>
                  <option value="ADD_NEW" className="text-blue-600 font-bold">
                    + New Category
                  </option>
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.value}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Color / Finish"
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                />
              </div>
              <textarea
                placeholder="Description"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm min-h-[80px]"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Stores Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Store Availability
                </h3>
                <button
                  type="button"
                  onClick={addStoreSource}
                  className="text-[#007b9e] text-xs font-bold flex items-center gap-1 hover:underline"
                >
                  <Plus size={14} /> Add Source
                </button>
              </div>
              {formData.storeEntries.map((entry, sIdx) => (
                <div
                  key={sIdx}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-5 relative space-y-4"
                >
                  <div className="flex gap-3">
                    <select
                      className="flex-1 p-3 bg-white border border-slate-200 rounded-xl text-sm"
                      value={entry.storeName}
                      onChange={(e) =>
                        updateStoreField(sIdx, "storeName", e.target.value)
                      }
                    >
                      <option value="">Select Store</option>
                      <option
                        value="ADD_NEW_STORE"
                        className="text-blue-600 font-bold"
                      >
                        + New Store
                      </option>
                      {stores.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <div className="w-32 flex items-center bg-white border border-slate-200 rounded-xl px-3">
                      <span className="text-slate-400 text-sm">€</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full bg-transparent outline-none text-sm font-bold ml-1"
                        value={entry.price}
                        onChange={(e) =>
                          updateStoreField(sIdx, "price", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  {/* Product Link for this specific store */}
                  <div className="w-full mt-2 mb-4">
                    <input
                      type="url"
                      placeholder="Product link (optional)"
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-blue-400 outline-none"
                      value={entry.link}
                      onChange={(e) =>
                        updateStoreField(sIdx, "link", e.target.value)
                      }
                    />
                  </div>

                  <div className="bg-white p-4 rounded-xl space-y-3">
                    {entry.inventory.map((inv, iIdx) => (
                      <div key={iIdx} className="flex gap-2">
                        <select
                          className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          value={inv.size}
                          disabled={!formData.category}
                          onChange={(e) =>
                            updateInventory(sIdx, iIdx, "size", e.target.value)
                          }
                        >
                          <option value="">Size</option>
                          {formData.category && (
                            <option
                              value="ADD_NEW_SIZE"
                              className="text-blue-600 font-bold"
                            >
                              + New Size
                            </option>
                          )}
                          {availableSizes.map((sz) => (
                            <option key={sz} value={sz}>
                              {sz}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="Qty"
                          className="w-20 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-center"
                          value={inv.qty}
                          onChange={(e) =>
                            updateInventory(sIdx, iIdx, "qty", e.target.value)
                          }
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addInventoryRow(sIdx)}
                      className="text-[10px] text-[#007b9e] font-bold uppercase hover:underline"
                    >
                      + Add Size
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons at the Bottom */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  // Clear current edit session
                  setEditingTempId(null);
                }}
                className="flex-1 py-4 px-6 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-4 px-6 bg-[#002d5a] text-white rounded-2xl font-bold hover:bg-[#001d3d] shadow-lg disabled:opacity-50 transition-all"
              >
                {isSubmitting
                  ? "Processing..."
                  : editingTempId
                    ? "Save Changes"
                    : "Create Supply Item"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- TEMPORARY SESSION LIST --- */}
      <section className="max-w-2xl mx-auto space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
          Added this session
        </h3>
        <div className="space-y-3">
          {addedItems.length === 0 ? (
            <div className="bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-sm italic">
              Items you add will appear here temporarily.
            </div>
          ) : (
            addedItems.map((item) => (
              <div
                key={item.tempId}
                className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm"
              >
                <div className="relative w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                  {item.localPreview ? (
                    <Image
                      src={item.localPreview}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Package size={16} className="m-auto mt-4 text-slate-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#002d5a] truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {item.category} • {item.color || "Standard"}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditRequest(item)}
                    className="p-2 text-slate-400 hover:text-[#007b9e]"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => removeLocalItem(item.tempId)}
                    className="p-2 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Modals */}
      {showCategoryModal && (
        <OptionModal
          title="New Category"
          placeholder="Internal Doors"
          value={newCategoryValue}
          onChange={setNewCategoryValue}
          onClose={() => setShowCategoryModal(false)}
          onSave={() => saveOption("category", newCategoryValue)}
        />
      )}
      {showStoreModal && (
        <OptionModal
          title="New Store"
          placeholder="LisLock Supply Store"
          value={newStoreValue}
          onChange={setNewStoreValue}
          onClose={() => setShowStoreModal(false)}
          onSave={() => saveOption("store", newStoreValue)}
        />
      )}
      {showSizeModal && (
        <OptionModal
          title={`New Size for ${formData.category}`}
          placeholder="78x30"
          value={newSizeValue}
          onChange={setNewSizeValue}
          onClose={() => setShowSizeModal(false)}
          onSave={() => saveOption("size", newSizeValue)}
        />
      )}
    </div>
  );
}

function OptionModal({
  title,
  placeholder,
  value,
  onChange,
  onClose,
  onSave,
}: OptionModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-lg font-bold text-[#002d5a] mb-2">{title}</h3>
        <input
          autoFocus
          placeholder={placeholder}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl mb-6 outline-none focus:border-[#007b9e]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSave()}
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm font-bold text-slate-400 hover:bg-slate-50 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 py-3 bg-[#007b9e] text-white text-sm font-bold rounded-xl shadow-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
