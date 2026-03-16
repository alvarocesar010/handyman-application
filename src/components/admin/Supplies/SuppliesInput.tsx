"use client";
import { useState, useRef } from "react";
import { Plus, Link as LinkIcon, Image as ImageIcon, X } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";
import { supplies } from "@/lib/supplies";

export default function SupplyInput() {
  const [stores, setStores] = useState(["B&Q", "Screwfix", "Woodies"]);
  const [categories, setCategories] = useState(supplies.map((s) => s.category));

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    store: "B&Q",
    description: "",
    link: "",
    category: "",
    size: "",
  });

  const selectedCategory = supplies.find(
    (s) => s.category === formData.category,
  );

  const sizes = selectedCategory?.size || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 5) {
      toast.warning("You can only upload up to 5 photos.");
      return;
    }
    const newFiles = [...files, ...selectedFiles];
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));

    setFiles(newFiles);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddOption = (type: "store" | "category") => {
    const newVal = prompt(`Enter new ${type} name:`);
    if (!newVal) return;
    if (type === "store") setStores((prev) => [...prev, newVal]);
    else setCategories((prev) => [...prev, newVal]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    // Append text fields
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    // Append files
    files.forEach((file) => data.append("photos", file));

    try {
      const res = await fetch("/api/supplies", {
        method: "POST",
        body: data, // Sending raw multipart/form-data
      });

      if (res.ok) {
        toast.success("Item saved to Cloud!");
        setFiles([]);
        setPreviews([]);
      }
    } catch (err) {
      console.error("Submission failed", err);
      toast.error("Upload failed");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 max-w-md p-6">
      <h2 className="text-xl font-bold mb-6 text-slate-800">
        Add New Supply Item
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Photo Upload */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-500 uppercase italic">
              Item Photos ({files.length}/5)
            </label>
          </div>

          {previews.length === 0 ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
            >
              <ImageIcon size={28} /> {/* Fixed: Using ImageIcon here */}
              <span className="text-xs mt-2 font-medium">
                Click to upload photos
              </span>
            </button>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {previews.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border border-slate-200"
                >
                  <Image
                    src={url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    width={20}
                    height={20}
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow-md"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              {files.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-300"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
        </div>

        <input
          placeholder="Item Name"
          value={formData.name}
          className="w-full p-3 border rounded-lg bg-slate-50 outline-none"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Price €"
          value={formData.price}
          className="w-full p-3 border rounded-lg bg-slate-50 outline-none"
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />

        {/* Store Selection - Fixed: Uses 'stores' and 'setStores' */}
        <div className="flex gap-2">
          <select
            className="flex-1 p-3 border rounded-lg bg-slate-50 outline-none"
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
          value={formData.description}
          className="w-full p-3 border rounded-lg bg-slate-50 outline-none"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        {/* Link Input - Fixed: Uses LinkIcon */}
        <div className="relative">
          <LinkIcon
            className="absolute left-3 top-3.5 text-slate-400"
            size={18}
          />
          <input
            placeholder="Product Link (URL)"
            value={formData.link}
            className="w-full p-3 pl-10 border rounded-lg bg-slate-50 outline-none"
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          />
        </div>

        {/* Category Selection - Fixed: Uses 'categories' and 'setCategories' */}
        <div className="flex gap-2">
          <select
            className="flex-1 p-3 border rounded-lg bg-slate-50 outline-none"
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

        {/* Size Selection - Fixed: Uses 'categories' and 'setCategories' */}
        <div className="flex gap-2">
          <select
            className="flex-1 p-3 border rounded-lg bg-slate-50 outline-none"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          >
            {sizes.map((c) => (
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
          className="w-full bg-[#007b9e] text-white py-3 rounded-xl font-bold hover:bg-[#005f7a] transition-colors"
        >
          Save Item
        </button>
      </form>
    </div>
  );
}
