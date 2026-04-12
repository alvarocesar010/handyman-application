"use client";

import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

interface Props {
  preview?: string; // This will be the photoUrl or the local Blob URL
  onImageSelect: (file: File) => void;
  onRemove: () => void;
}

export default function PhotoUploader({
  preview,
  onImageSelect,
  onRemove,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleInternalRemove = () => {
    // Reset the actual input value so the same file can be re-selected later
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onRemove();
  };

  return (
    <div className="relative group mb-2">
      {preview ? (
        <div className="relative w-24 h-20 rounded-lg overflow-hidden border bg-gray-100">
          <Image src={preview} alt="" fill className="object-cover" />
          <button
            type="button"
            onClick={handleInternalRemove} // Use the internal reset
            className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-24 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
        >
          <Plus size={20} />
          <span className="text-[10px] mt-1 font-bold">ADD PHOTO</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
