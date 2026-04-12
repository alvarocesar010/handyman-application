"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X, Plus, Trash, Loader2 } from "lucide-react";
import { CategoryDoc } from "@/lib/store/getCategoryBySlug";
import Image from "next/image";
import PhotoUploader from "@/components/PhotoUploader";

export default function CategoryCard({
  categoryItem,
}: {
  categoryItem: CategoryDoc;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState(categoryItem);
  const [pendingFiles, setPendingFiles] = useState<{ [key: string]: File }>({});

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      // 1. Upload all pending files and get their new URLs
      const uploadResults = await Promise.all(
        Object.entries(pendingFiles).map(async ([subId, file]) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", "store-categories");
          formData.append("slug", editedData.category);

          const res = await fetch("/api/admin/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error("Upload failed");

          const { publicUrl, objectPath } = await res.json();
          return { subId, publicUrl, objectPath };
        }),
      );

      // 2. Create the clean data object for the database
      // We replace the temporary "blob" URLs with the permanent publicUrls
      const finalSubCategories = editedData.subCategories.map((sub) => {
        const upload = uploadResults.find((r) => r.subId === sub._id);
        if (upload) {
          return {
            ...sub,
            photoUrl: upload.publicUrl,
            photoPath: upload.objectPath,
          };
        }
        return sub;
      });

      const finalData = {
        ...editedData,
        subCategories: finalSubCategories,
      };

      // 3. Save to DB
      const res = await fetch(`/api/admin/store/${categoryItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (!res.ok) throw new Error("Update failed");

      // Success: Clear state and exit edit mode
      setPendingFiles({});
      setIsEditing(false);
      // Optionally refresh data from parent or reload
      // window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error saving changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (
      !confirm("Are you sure? This will delete the category and all sub-items.")
    )
      return;
    try {
      const res = await fetch(`/api/admin/store/${categoryItem._id}`, {
        method: "DELETE",
      });
      if (res.ok) window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to delete category");
    }
  };

  const handleImageSelect = (index: number, subId: string, file: File) => {
    const localUrl = URL.createObjectURL(file);
    handleSubChange(index, "photoUrl", localUrl);
    setPendingFiles((prev) => ({ ...prev, [subId]: file }));
  };

  const handleRemovePhoto = (index: number, subId: string) => {
    // 1. Clean up local browser memory if it's a preview
    if (editedData.subCategories[index].photoUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(editedData.subCategories[index].photoUrl);
    }

    // 2. Clear state for this specific subcategory
    const newSubs = [...editedData.subCategories];
    newSubs[index] = {
      ...newSubs[index],
      photoUrl: "",
      photoPath: "", // CRITICAL: Clear the path so the DB knows it's gone
    };

    setEditedData({ ...editedData, subCategories: newSubs });

    // 3. Remove from the upload queue
    setPendingFiles((prev) => {
      const updated = { ...prev };
      delete updated[subId];
      return updated;
    });
  };

  const handleSubChange = (index: number, field: string, value: string) => {
    const newSubs = [...editedData.subCategories];
    newSubs[index] = { ...newSubs[index], [field]: value };
    setEditedData({ ...editedData, subCategories: newSubs });
  };

  const addSubCategory = () => {
    const newSub = {
      _id: crypto.randomUUID(),
      slug: "new-subcategory",
      href: "/category/new",
      photoUrl: "",
      photoPath: "",
    };
    setEditedData({
      ...editedData,
      subCategories: [...editedData.subCategories, newSub],
    });
  };

  const removeSubCategory = (index: number, subId: string) => {
    const filtered = editedData.subCategories.filter((_, i) => i !== index);
    setEditedData({ ...editedData, subCategories: filtered });
    const newPending = { ...pendingFiles };
    delete newPending[subId];
    setPendingFiles(newPending);
  };

  return (
    <div className="max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-1 transition-all hover:shadow-md">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-cyan-50 text-cyan-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Category
          </span>
          <div className="flex gap-3 text-gray-400">
            {isEditing ? (
              <>
                <button
                  onClick={addSubCategory}
                  className="flex items-center gap-1 text-xs font-bold text-cyan-600 hover:bg-cyan-100 px-2 py-1 rounded-md"
                >
                  <Plus className="w-4 h-4" /> Add Sub
                </button>
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
                ) : (
                  <Check
                    className="w-5 h-5 cursor-pointer hover:text-green-500"
                    onClick={handleUpdate}
                  />
                )}
                <X
                  className="w-5 h-5 cursor-pointer hover:text-red-500"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedData(categoryItem);
                    setPendingFiles({});
                  }}
                />
              </>
            ) : (
              <>
                <Pencil
                  className="w-5 h-5 cursor-pointer hover:text-blue-500"
                  onClick={() => setIsEditing(true)}
                />
                <Trash2
                  className="w-5 h-5 cursor-pointer hover:text-red-500"
                  onClick={handleDeleteCategory}
                />
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <input
            value={editedData.category}
            onChange={(e) =>
              setEditedData({ ...editedData, category: e.target.value })
            }
            className="text-2xl font-bold text-gray-800 border-b-2 border-cyan-400 focus:outline-none w-full mb-4 bg-transparent"
          />
        ) : (
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {editedData.category}
          </h2>
        )}

        <div className="space-y-3">
          {editedData.subCategories?.map((s, index) => (
            <div
              key={s._id}
              className="relative bg-gray-50 p-3 rounded-xl border border-gray-100 group"
            >
              {isEditing ? (
                <div className="flex flex-col gap-2 pr-8">
                  <button
                    onClick={() => removeSubCategory(index, s._id)}
                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500"
                  >
                    <Trash className="w-4 h-4" />
                  </button>

                  <PhotoUploader
                    preview={s.photoUrl}
                    onImageSelect={(file) =>
                      handleImageSelect(index, s._id, file)
                    }
                    onRemove={() => handleRemovePhoto(index, s._id)}
                  />

                  <input
                    placeholder="Name"
                    value={s.slug}
                    onChange={(e) =>
                      handleSubChange(index, "slug", e.target.value)
                    }
                    className="font-semibold text-gray-700 border-b border-gray-200 focus:border-cyan-400 outline-none bg-transparent"
                  />
                  <input
                    placeholder="Link"
                    value={s.href}
                    onChange={(e) =>
                      handleSubChange(index, "href", e.target.value)
                    }
                    className="text-xs text-gray-500 border-b border-gray-200 focus:border-cyan-400 outline-none bg-transparent"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {s.photoUrl && (
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                      <Image
                        src={s.photoUrl}
                        alt={s.slug}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="font-semibold text-gray-700 truncate">
                      {s.slug}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {s.href}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
